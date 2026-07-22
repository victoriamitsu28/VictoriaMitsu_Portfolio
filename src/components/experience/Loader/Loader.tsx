"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { getClientCapabilities } from "@/lib/clientCapabilities";
import { useAppStore } from "@/store/useAppStore";
import styles from "./Loader.module.scss";

function waitForImage(image: HTMLImageElement | null) {
  if (!image || image.complete) return Promise.resolve();
  return new Promise<void>((resolve) => {
    const finish = () => resolve();
    image.addEventListener("load", finish, { once: true });
    image.addEventListener("error", finish, { once: true });
  });
}

function waitForVideo(video: HTMLVideoElement | null) {
  if (!video || video.readyState >= 2) return Promise.resolve();
  return new Promise<void>((resolve) => {
    const finish = () => resolve();
    video.addEventListener("loadeddata", finish, { once: true });
    video.addEventListener("error", finish, { once: true });
  });
}

async function waitForHeroAssets() {
  const heroImage = document.querySelector<HTMLImageElement>("[data-hero-background] img");
  const projectVideo = document.querySelector<HTMLVideoElement>("[data-project-window] video");
  const assetsReady = Promise.all([
    waitForImage(heroImage),
    waitForVideo(projectVideo),
    document.fonts ? document.fonts.ready : Promise.resolve(),
  ]);
  const timeout = new Promise<void>((resolve) => window.setTimeout(resolve, 1400));
  await Promise.race([assetsReady, timeout]);
}

export function Loader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderComplete = useAppStore((state) => state.loaderComplete);
  const setLoaderComplete = useAppStore((state) => state.setLoaderComplete);

  useEffect(() => {
    if (loaderComplete) {
      if (loaderRef.current) loaderRef.current.style.display = "none";
      return;
    }

    const capabilities = getClientCapabilities();
    if (
      capabilities.reducedMotion ||
      capabilities.coarsePointer ||
      capabilities.saveData ||
      capabilities.slowConnection
    ) {
      setLoaderComplete(true);
      if (loaderRef.current) loaderRef.current.style.display = "none";
      return;
    }

    let cancelled = false;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-loader-structure]",
        { scaleX: 0 },
        { scaleX: 1, duration: 1.4, ease: "power3.inOut", stagger: 0.08 },
      );

      waitForHeroAssets().then(() => {
        if (cancelled) return;

        const tl = gsap.timeline({ defaults: { ease: "power4.inOut" } });
        tl.to("[data-loader-label]", { yPercent: -120, duration: 0.55, stagger: 0.04 })
          .call(() => setLoaderComplete(true))
          .to(loaderRef.current, { autoAlpha: 0, duration: 0.5 }, "+=0.08")
          .set(loaderRef.current, { display: "none" });
      });
    }, loaderRef);

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, [loaderComplete, setLoaderComplete]);

  return (
    <div ref={loaderRef} className={styles.loader} aria-hidden="true">
      <div className={styles.interface}>
        <div className={styles.labelClip}>
          <span data-loader-label>Loading media structure</span>
        </div>
        <div className={styles.structure} data-loader-structure />
        <div className={styles.labelClip}>
          <span data-loader-label>Hero ready soon</span>
        </div>
      </div>
    </div>
  );
}
