"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getClientCapabilities } from "@/lib/clientCapabilities";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const capabilities = getClientCapabilities();
    if (
      capabilities.reducedMotion ||
      capabilities.coarsePointer ||
      capabilities.saveData ||
      capabilities.slowConnection ||
      capabilities.constrainedHardware
    ) return;

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    const onScroll = () => ScrollTrigger.update();
    const update = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", onScroll);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return children;
}
