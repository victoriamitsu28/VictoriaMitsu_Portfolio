"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { getClientCapabilities } from "@/lib/clientCapabilities";

const WebGLExperience = dynamic(
  () => import("@/components/webgl/WebGLExperience/WebGLExperience").then((mod) => mod.WebGLExperience),
  { ssr: false },
);

const CustomCursor = dynamic(
  () => import("@/components/experience/CustomCursor/CustomCursor").then((mod) => mod.CustomCursor),
  { ssr: false },
);

export function ExperienceLayer() {
  const [mountWebGL, setMountWebGL] = useState(false);
  const [mountCursor, setMountCursor] = useState(false);

  useEffect(() => {
    const capabilities = getClientCapabilities();
    const enhancedExperience =
      !capabilities.reducedMotion &&
      !capabilities.coarsePointer &&
      !capabilities.saveData &&
      !capabilities.slowConnection;

    const desktopEffects = enhancedExperience && window.innerWidth >= 1025;
    const cursorId = globalThis.setTimeout(() => setMountCursor(desktopEffects), 0);
    if (!desktopEffects || capabilities.constrainedHardware) {
      return () => globalThis.clearTimeout(cursorId);
    }

    const webglId = globalThis.setTimeout(() => setMountWebGL(true), 1200);
    return () => {
      globalThis.clearTimeout(cursorId);
      globalThis.clearTimeout(webglId);
    };
  }, []);

  return (
    <>
      {mountCursor ? <CustomCursor /> : null}
      {mountWebGL ? <WebGLExperience /> : null}
    </>
  );
}
