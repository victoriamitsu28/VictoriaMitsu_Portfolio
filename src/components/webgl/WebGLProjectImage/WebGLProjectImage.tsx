"use client";

import Image from "next/image";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useWebGLCapability } from "@/hooks/useWebGLCapability";
import styles from "./WebGLProjectImage.module.scss";

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform vec2 uTextureSize;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform float uVelocity;
  uniform float uScrollVelocity;
  uniform vec3 uAccent;

  varying vec2 vUv;

  vec2 coverUv(vec2 uv, vec2 screenSize, vec2 imageSize) {
    float screenRatio = screenSize.x / screenSize.y;
    float imageRatio = imageSize.x / imageSize.y;
    vec2 scale = vec2(1.0);

    if (screenRatio > imageRatio) {
      scale.y = imageRatio / screenRatio;
    } else {
      scale.x = screenRatio / imageRatio;
    }

    return (uv - 0.5) * scale + 0.5;
  }

  void main() {
    vec2 uv = coverUv(vUv, uResolution, uTextureSize);
    float energy = clamp(uVelocity + uScrollVelocity * 0.72, 0.0, 1.0);

    float distanceToMouse = distance(vUv, uMouse);
    float influence = smoothstep(0.55, 0.0, distanceToMouse);

    float wave = sin((vUv.y * 22.0) + uTime * 2.2) * 0.0045;
    float ripple = sin((distanceToMouse * 38.0) - uTime * 3.0) * 0.006;

    vec2 distortion = vec2(
      wave * energy + ripple * influence * energy,
      ripple * 0.35 * influence * energy
    );

    float split = 0.008 * energy * influence + 0.0025 * uScrollVelocity;

    vec4 base = texture2D(uTexture, uv + distortion);
    float red = texture2D(uTexture, uv + distortion + vec2(split, 0.0)).r;
    float blue = texture2D(uTexture, uv + distortion - vec2(split, 0.0)).b;

    vec3 color = vec3(red, base.g, blue);
    float accentMix = clamp(energy * 0.2 + influence * uVelocity * 0.12, 0.0, 0.28);
    color = mix(color, color * uAccent + uAccent * 0.12, accentMix);
    float vignette = smoothstep(0.92, 0.28, distance(vUv, vec2(0.5)));
    color *= mix(0.88, 1.0, vignette);

    gl_FragColor = vec4(color, 1.0);
  }
`;

type ShaderPlaneProps = {
  src: string;
  accent: string;
};

function ShaderPlane({ src, accent }: ShaderPlaneProps) {
  const texture = useLoader(THREE.TextureLoader, src);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();

  const lastPointerRef = useRef(new THREE.Vector2(0, 0));
  const pointerVelocityRef = useRef(0);
  const scrollVelocityRef = useRef(0);
  const lastScrollRef = useRef(0);

  const textureSize = useMemo(() => {
    const source = texture.image as { width?: number; height?: number } | undefined;
    return new THREE.Vector2(source?.width ?? 1, source?.height ?? 1);
  }, [texture]);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uTextureSize: { value: textureSize },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uVelocity: { value: 0 },
      uScrollVelocity: { value: 0 },
      uAccent: { value: new THREE.Color(accent) },
    }),
    [texture, textureSize, size.width, size.height, accent],
  );

  useEffect(() => {
    lastScrollRef.current = window.scrollY;

    const onScroll = () => {
      const current = window.scrollY;
      const delta = Math.abs(current - lastScrollRef.current);
      scrollVelocityRef.current = Math.max(
        scrollVelocityRef.current,
        Math.min(delta / 85, 1),
      );
      lastScrollRef.current = current;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame((state, delta) => {
    const material = materialRef.current;
    if (!material) return;

    const pointer = state.pointer;
    const dx = pointer.x - lastPointerRef.current.x;
    const dy = pointer.y - lastPointerRef.current.y;
    const speed = Math.min(Math.hypot(dx, dy) * 8.0, 1.0);

    pointerVelocityRef.current = Math.max(pointerVelocityRef.current, speed);
    pointerVelocityRef.current = THREE.MathUtils.damp(
      pointerVelocityRef.current,
      0,
      5.0,
      delta,
    );
    scrollVelocityRef.current = THREE.MathUtils.damp(
      scrollVelocityRef.current,
      0,
      4.5,
      delta,
    );

    lastPointerRef.current.set(pointer.x, pointer.y);

    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uVelocity.value = pointerVelocityRef.current;
    material.uniforms.uScrollVelocity.value = scrollVelocityRef.current;
    material.uniforms.uMouse.value.set(
      pointer.x * 0.5 + 0.5,
      pointer.y * 0.5 + 0.5,
    );
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        toneMapped={false}
      />
    </mesh>
  );
}

type WebGLProjectImageProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  accent?: string;
};

export function WebGLProjectImage({
  src,
  alt,
  sizes,
  priority = false,
  accent = "#ffffff",
}: WebGLProjectImageProps) {
  const enabled = useWebGLCapability();

  return (
    <div className={styles.root}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={styles.fallbackImage}
      />

      {enabled && (
        <div className={styles.canvasLayer} aria-hidden="true">
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 1.8], fov: 50 }}
            gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
          >
            <ShaderPlane src={src} accent={accent} />
          </Canvas>
        </div>
      )}
    </div>
  );
}
