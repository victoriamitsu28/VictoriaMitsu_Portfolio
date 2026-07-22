/* eslint-disable @next/next/no-img-element */
"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useAppStore } from "@/store/useAppStore";
import styles from "./TransitionProvider.module.scss";

type NavigationPayload = {
  href: string;
  imageSrc: string;
  label: string;
  sourceElement: HTMLElement;
  accent: string;
  background: string;
};

type TransitionContextValue = {
  navigate: (payload: NavigationPayload) => void;
  active: boolean;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function usePageTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("usePageTransition must be used inside TransitionProvider");
  }
  return context;
}

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const overlayRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const accentBarRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  const pendingPathRef = useRef<string | null>(null);
  const previousOverflowRef = useRef("");
  const routeTimerRef = useRef<number | null>(null);

  const [active, setActive] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [label, setLabel] = useState("");

  const setTransitionActive = useAppStore((state) => state.setTransitionActive);

  const unlockDocument = useCallback(() => {
    document.documentElement.style.overflow = previousOverflowRef.current;
    document.body.style.pointerEvents = "";
  }, []);

  const finishTransition = useCallback(() => {
    const overlay = overlayRef.current;
    const frame = frameRef.current;
    const labelNode = labelRef.current;
    const counter = counterRef.current;
    const accentBar = accentBarRef.current;
    const flash = flashRef.current;

    if (!overlay || !frame) return;

    window.scrollTo(0, 0);
    ScrollTrigger.refresh();

    const timeline = gsap.timeline({
      defaults: { ease: "power4.inOut" },
      onComplete: () => {
        gsap.set(overlay, { display: "none" });
        gsap.set(frame, { clearProps: "all" });
        gsap.set([labelNode, counter], { clearProps: "all" });

        pendingPathRef.current = null;
        setActive(false);
        setTransitionActive(false);
        unlockDocument();
        ScrollTrigger.refresh();
      },
    });

    timeline
      .to(labelNode, { yPercent: -140, duration: 0.55 }, 0)
      .to(counter, { opacity: 0, duration: 0.3 }, 0)
      .to(accentBar, { scaleX: 0, transformOrigin: "right center", duration: 0.65 }, 0)
      .to(flash, { opacity: 0, duration: 0.45 }, 0)
      .to(frame, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.9,
      }, 0.08);
  }, [setTransitionActive, unlockDocument]);

  useEffect(() => {
    if (!active || !pendingPathRef.current) return;
    if (pathname !== pendingPathRef.current) return;

    if (routeTimerRef.current) {
      window.clearTimeout(routeTimerRef.current);
    }

    routeTimerRef.current = window.setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => finishTransition());
      });
    }, 120);

    return () => {
      if (routeTimerRef.current) {
        window.clearTimeout(routeTimerRef.current);
      }
    };
  }, [pathname, active, finishTransition]);

  const navigate = useCallback((payload: NavigationPayload) => {
    if (active) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const currentPath = window.location.pathname;

    if (payload.href === currentPath) return;

    if (reducedMotion) {
      router.push(payload.href);
      return;
    }

    const overlay = overlayRef.current;
    const frame = frameRef.current;
    const image = imageRef.current;
    const labelNode = labelRef.current;
    const counter = counterRef.current;
    const accentBar = accentBarRef.current;
    const flash = flashRef.current;

    if (!overlay || !frame || !image || !labelNode || !counter || !accentBar || !flash) {
      router.push(payload.href);
      return;
    }

    const rect = payload.sourceElement.getBoundingClientRect();
    const computed = window.getComputedStyle(payload.sourceElement);
    const borderRadius = computed.borderRadius || "0px";

    previousOverflowRef.current = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.pointerEvents = "none";

    image.src = payload.imageSrc;
    setImageSrc(payload.imageSrc);
    setLabel(payload.label);
    setActive(true);
    setTransitionActive(true);
    pendingPathRef.current = payload.href;

    overlay.style.setProperty("--transition-accent", payload.accent);
    overlay.style.setProperty("--transition-background", payload.background);

    gsap.set(overlay, { display: "block" });
    gsap.set(frame, {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
      borderRadius,
      clipPath: "inset(0% 0% 0% 0%)",
    });
    gsap.set(image, { scale: 1.03 });
    gsap.set(labelNode, { yPercent: 140 });
    gsap.set(counter, { opacity: 0 });
    gsap.set(accentBar, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(flash, { opacity: 0 });

    const timeline = gsap.timeline({ defaults: { ease: "power4.inOut" } });

    timeline
      .to(frame, {
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        borderRadius: 0,
        duration: 0.95,
      }, 0)
      .to(image, { scale: 1, duration: 0.95 }, 0)
      .to(flash, { opacity: 0.22, duration: 0.12, yoyo: true, repeat: 1 }, 0.18)
      .to(accentBar, { scaleX: 1, duration: 0.58, ease: "power3.inOut" }, 0.16)
      .to(labelNode, { yPercent: 0, duration: 0.7 }, 0.26)
      .to(counter, { opacity: 1, duration: 0.35 }, 0.4)
      .call(() => router.push(payload.href), [], 0.72);
  }, [active, router, setTransitionActive]);

  useEffect(() => {
    return () => {
      if (routeTimerRef.current) {
        window.clearTimeout(routeTimerRef.current);
      }
      unlockDocument();
    };
  }, [unlockDocument]);

  const value = useMemo<TransitionContextValue>(
    () => ({ navigate, active }),
    [navigate, active],
  );

  return (
    <TransitionContext.Provider value={value}>
      {children}

      <div ref={overlayRef} className={styles.overlay} aria-hidden="true">
        <div ref={frameRef} className={styles.frame}>
          <img
            ref={imageRef}
            src={imageSrc || "/media/project-chery-poster.jpg"}
            alt=""
            className={styles.image}
            draggable={false}
          />
          <div className={styles.shade} />
          <div ref={flashRef} className={styles.flash} />
          <div ref={accentBarRef} className={styles.accentBar} />

          <div className={styles.interface}>
            <span className={styles.labelClip}>
              <span ref={labelRef}>{label}</span>
            </span>

            <span ref={counterRef} className={styles.counter}>OPEN</span>
          </div>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
