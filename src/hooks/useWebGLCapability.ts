"use client";

import { useEffect, useState } from "react";
import { getClientCapabilities } from "@/lib/clientCapabilities";

export function useWebGLCapability() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const desktopWidth = window.matchMedia("(min-width: 1025px)");

    const update = () => {
      const canvas = document.createElement("canvas");
      const hasWebGL = Boolean(
        canvas.getContext("webgl2") || canvas.getContext("webgl"),
      );

      const capabilities = getClientCapabilities();
      setEnabled(
        hasWebGL &&
          !reducedMotion.matches &&
          !coarsePointer.matches &&
          desktopWidth.matches &&
          !capabilities.saveData &&
          !capabilities.slowConnection &&
          !capabilities.constrainedHardware,
      );
    };

    update();

    reducedMotion.addEventListener("change", update);
    coarsePointer.addEventListener("change", update);
    desktopWidth.addEventListener("change", update);

    return () => {
      reducedMotion.removeEventListener("change", update);
      coarsePointer.removeEventListener("change", update);
      desktopWidth.removeEventListener("change", update);
    };
  }, []);

  return enabled;
}
