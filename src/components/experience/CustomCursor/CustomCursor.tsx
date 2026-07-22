/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useAppStore } from "@/store/useAppStore";
import styles from "./CustomCursor.module.scss";

type CursorMode = "default" | "link" | "view" | "drag" | "hidden";

type HoverTarget = HTMLElement & {
  dataset: DOMStringMap & {
    cursor?: CursorMode;
    cursorLabel?: string;
    cursorPreview?: string;
  };
};

const DEFAULT_LABELS: Record<Exclude<CursorMode, "default" | "hidden">, string> = {
  link: "OPEN",
  view: "VIEW",
  drag: "DRAG",
};

export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewImageRef = useRef<HTMLImageElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const transitionActive = useAppStore((state) => state.transitionActive);
  const setCursorVariant = useAppStore((state) => state.setCursorVariant);

  const [previewSrc, setPreviewSrc] = useState("");

  useEffect(() => {
    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const preview = previewRef.current;
    const previewImage = previewImageRef.current;
    const label = labelRef.current;

    if (!root || !dot || !ring || !preview || !previewImage || !label) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!finePointer) {
      gsap.set(root, { display: "none" });
      return;
    }

    document.documentElement.classList.add("cursor-enabled");

    let mode: CursorMode = "default";
    let activeTarget: HoverTarget | null = null;
    let lastX = window.innerWidth / 2;
    let lastY = window.innerHeight / 2;
    let lastTime = performance.now();

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: reducedMotion ? 0 : 0.48, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: reducedMotion ? 0 : 0.48, ease: "power3.out" });
    const previewX = gsap.quickTo(preview, "x", { duration: reducedMotion ? 0 : 0.65, ease: "power4.out" });
    const previewY = gsap.quickTo(preview, "y", { duration: reducedMotion ? 0 : 0.65, ease: "power4.out" });
    const ringScaleX = gsap.quickTo(ring, "scaleX", { duration: 0.3, ease: "power3.out" });
    const ringRotation = gsap.quickTo(ring, "rotation", { duration: 0.3, ease: "power3.out" });

    const setMode = (nextMode: CursorMode, nextLabel?: string) => {
      mode = nextMode;
      setCursorVariant(nextMode === "link" ? "default" : nextMode);
      root.dataset.mode = nextMode;

      const fallback = nextMode === "default" || nextMode === "hidden" ? "" : DEFAULT_LABELS[nextMode];
      label.textContent = nextLabel || fallback;

      gsap.to(label, {
        opacity: nextMode === "view" || nextMode === "drag" || nextMode === "link" ? 1 : 0,
        yPercent: nextMode === "default" || nextMode === "hidden" ? 30 : 0,
        duration: 0.25,
        ease: "power3.out",
      });

      gsap.to(ring, {
        width: nextMode === "view" ? 88 : nextMode === "drag" ? 76 : nextMode === "link" ? 54 : 34,
        height: nextMode === "view" ? 88 : nextMode === "drag" ? 76 : nextMode === "link" ? 54 : 34,
        opacity: nextMode === "hidden" ? 0 : 1,
        duration: 0.35,
        ease: "power4.out",
      });

      gsap.to(dot, {
        scale: nextMode === "default" ? 1 : nextMode === "hidden" ? 0 : 0.2,
        opacity: nextMode === "hidden" ? 0 : 1,
        duration: 0.25,
        ease: "power3.out",
      });
    };

    const hidePreview = () => {
      gsap.to(preview, {
        opacity: 0,
        scale: 0.86,
        rotate: -2,
        duration: 0.35,
        ease: "power4.out",
      });
    };

    const showPreview = (src: string) => {
      if (!src) return;
      setPreviewSrc(src);
      previewImage.src = src;
      gsap.fromTo(
        preview,
        { opacity: 0, scale: 0.82, rotate: -4 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.48, ease: "power4.out" },
      );
    };

    const updateTarget = (target: EventTarget | null) => {
      const element = target instanceof Element
        ? target.closest<HoverTarget>("[data-cursor], [data-cursor-preview]")
        : null;

      if (element === activeTarget) return;

      activeTarget = element;

      if (!element) {
        setMode("default");
        hidePreview();
        return;
      }

      const nextMode = element.dataset.cursor || (element.dataset.cursorPreview ? "view" : "default");
      setMode(nextMode, element.dataset.cursorLabel);

      if (element.dataset.cursorPreview) {
        showPreview(element.dataset.cursorPreview);
      } else {
        hidePreview();
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max(16, now - lastTime);
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      const speed = Math.min(1, Math.hypot(dx, dy) / dt / 2.2);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);

      previewX(event.clientX + 34);
      previewY(event.clientY + 34);

      if (!reducedMotion && mode === "default") {
        ringScaleX(1 + speed * 0.65);
        ringRotation(angle);
      } else {
        ringScaleX(1);
      }

      lastX = event.clientX;
      lastY = event.clientY;
      lastTime = now;

      updateTarget(event.target);
    };

    const onPointerOver = (event: PointerEvent) => updateTarget(event.target);
    const onPointerOut = (event: PointerEvent) => {
      const next = event.relatedTarget;
      if (!(next instanceof Node) || !activeTarget?.contains(next)) {
        updateTarget(next);
      }
    };

    const onPointerLeave = () => gsap.to(root, { opacity: 0, duration: 0.2 });
    const onPointerEnter = () => gsap.to(root, { opacity: 1, duration: 0.2 });

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerover", onPointerOver, { passive: true });
    document.addEventListener("pointerout", onPointerOut, { passive: true });
    document.documentElement.addEventListener("mouseleave", onPointerLeave);
    document.documentElement.addEventListener("mouseenter", onPointerEnter);

    return () => {
      document.documentElement.classList.remove("cursor-enabled");
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      document.documentElement.removeEventListener("mouseleave", onPointerLeave);
      document.documentElement.removeEventListener("mouseenter", onPointerEnter);
      setCursorVariant("default");
    };
  }, [setCursorVariant]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.to(root, {
      autoAlpha: transitionActive ? 0 : 1,
      duration: 0.25,
      overwrite: true,
    });
  }, [transitionActive]);

  return (
    <div ref={rootRef} className={styles.root} aria-hidden="true" data-mode="default">
      <div ref={previewRef} className={styles.preview}>
        <img ref={previewImageRef} src={previewSrc || "/media/work/chery.jpg"} alt="" draggable={false} />
        <span className={styles.previewIndex}>PROJECT PREVIEW</span>
      </div>

      <div ref={ringRef} className={styles.ring}>
        <span ref={labelRef} className={styles.label} />
      </div>

      <div ref={dotRef} className={styles.dot} />
    </div>
  );
}
