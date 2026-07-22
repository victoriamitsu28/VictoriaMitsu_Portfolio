"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useWebGLCapability } from "@/hooks/useWebGLCapability";
import styles from "./WebGLExperience.module.scss";

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uPointerEnergy;
  uniform float uScrollEnergy;
  uniform vec2 uMouse;
  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  void main() {
    vec2 uv = vUv;
    float energy = clamp(uPointerEnergy * 0.8 + uScrollEnergy * 0.55, 0.0, 1.0);

    float d = distance(uv, uMouse);
    float glow = smoothstep(0.44, 0.0, d) * energy;
    float scan = sin((uv.y + uTime * 0.035) * 220.0) * 0.5 + 0.5;
    float grain = hash(uv * 900.0 + uTime * 0.35);

    vec3 warm = vec3(1.0, 0.56, 0.31);
    vec3 blue = vec3(0.25, 0.34, 1.0);
    vec3 color = mix(warm, blue, smoothstep(0.0, 1.0, uv.x));

    float alpha =
      glow * 0.055 +
      scan * 0.008 +
      grain * 0.015;

    gl_FragColor = vec4(color, alpha);
  }
`;

function ExperiencePlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  const pointerEnergyRef = useRef(0);
  const scrollEnergyRef = useRef(0);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const lastScrollRef = useRef(0);
  const targetMouseRef = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointerEnergy: { value: 0 },
      uScrollEnergy: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    [],
  );

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const dx = event.clientX - lastPointerRef.current.x;
      const dy = event.clientY - lastPointerRef.current.y;
      const velocity = Math.min(Math.hypot(dx, dy) / 90, 1);

      pointerEnergyRef.current = Math.max(pointerEnergyRef.current, velocity);
      lastPointerRef.current = { x: event.clientX, y: event.clientY };
      targetMouseRef.current.set(
        event.clientX / window.innerWidth,
        1 - event.clientY / window.innerHeight,
      );
    };

    const onScroll = () => {
      const current = window.scrollY;
      const delta = Math.abs(current - lastScrollRef.current);
      scrollEnergyRef.current = Math.max(
        scrollEnergyRef.current,
        Math.min(delta / 90, 1),
      );
      lastScrollRef.current = current;
    };

    lastScrollRef.current = window.scrollY;
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useFrame((state, delta) => {
    const material = materialRef.current;
    if (!material) return;

    pointerEnergyRef.current = THREE.MathUtils.damp(
      pointerEnergyRef.current,
      0,
      5.5,
      delta,
    );
    scrollEnergyRef.current = THREE.MathUtils.damp(
      scrollEnergyRef.current,
      0,
      4.2,
      delta,
    );

    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uPointerEnergy.value = pointerEnergyRef.current;
    material.uniforms.uScrollEnergy.value = scrollEnergyRef.current;
    material.uniforms.uMouse.value.lerp(targetMouseRef.current, 0.08);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        depthTest={false}
        toneMapped={false}
      />
    </mesh>
  );
}

export function WebGLExperience() {
  const enabled = useWebGLCapability();
  const dpr = useMemo<[number, number]>(() => {
    const nav = navigator as Navigator & { deviceMemory?: number };
    const memory = nav.deviceMemory ?? 4;
    const cores = navigator.hardwareConcurrency ?? 4;
    const maxDpr = memory >= 8 && cores >= 8 ? 1.5 : memory >= 4 && cores >= 4 ? 1.25 : 1;
    return [1, Math.min(window.devicePixelRatio || 1, maxDpr)];
  }, []);

  if (!enabled) return null;

  return (
    <div className={styles.layer} aria-hidden="true">
      <Canvas
        orthographic
        camera={{ position: [0, 0, 2], zoom: 1 }}
        dpr={dpr}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      >
        <ExperiencePlane />
      </Canvas>
    </div>
  );
}
