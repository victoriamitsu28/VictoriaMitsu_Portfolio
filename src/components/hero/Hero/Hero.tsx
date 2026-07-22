"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useAppStore } from "@/store/useAppStore";
import styles from "./Hero.module.scss";

function NameWord({ word, className = "" }: { word: string; className?: string }) {
  return (
    <span className={`${styles.nameClip} ${className}`}>
      <span className={styles.nameLine} data-name-line aria-hidden="true">
        {Array.from(word).map((letter, index) => (
          <span className={styles.letterSlot} data-name-letter key={`${letter}-${index}`}>
            {letter}
          </span>
        ))}
      </span>
    </span>
  );
}

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const loaderComplete = useAppStore((state) => state.loaderComplete);

  useGSAP(
    () => {
      const hero = heroRef.current;
      if (!hero) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
      const background = hero.querySelector<HTMLElement>("[data-hero-background]");
      const nameStage = hero.querySelector<HTMLElement>("[data-name-stage]");
      const nameTitle = hero.querySelector<HTMLElement>("[data-name-title]");
      const nameLines = gsap.utils.toArray<HTMLElement>("[data-name-line]");
      const atmosphere = hero.querySelector<HTMLElement>("[data-hero-atmosphere]");
      const foreground = hero.querySelector<HTMLElement>("[data-hero-foreground]");

      if (!loaderComplete) {
        gsap.set([background, foreground, nameLines], { clearProps: "all" });
        return;
      }

      if (reducedMotion) {
        gsap.set([background, foreground, nameLines].filter(Boolean), { clearProps: "all" });
        return;
      }

      gsap.set(background, { scale: 1.08, clipPath: "inset(0 8% 0 8%)" });
      gsap.set(nameLines, { yPercent: 115 });
      gsap.set(foreground, { yPercent: 7, scale: 0.96, opacity: 0 });

      const introTimeline = gsap.timeline({ defaults: { ease: "power4.out" } });
      introTimeline
        .to(background, { scale: 1, clipPath: "inset(0 0% 0 0%)", duration: 2.1 }, 0)
        .to(nameLines, { yPercent: 0, duration: 1.35, stagger: 0.1 }, 0.24)
        .to(foreground, { yPercent: 0, scale: 1, opacity: 1, duration: 1.65 }, 0.35);

      if (background) {
        gsap.to(background, {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
        });
      }

      if (nameStage) {
        gsap.to(nameStage, {
          yPercent: -16,
          opacity: 0.18,
          ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
        });
      }

      if (coarsePointer || !background || !nameStage) return;

      const backgroundX = gsap.quickTo(background, "x", { duration: 1.5, ease: "power3.out" });
      const backgroundY = gsap.quickTo(background, "y", { duration: 1.5, ease: "power3.out" });
      const nameX = gsap.quickTo(nameStage, "x", { duration: 1.8, ease: "power3.out" });
      const atmosphereX = atmosphere ? gsap.quickTo(atmosphere, "x", { duration: 2, ease: "power3.out" }) : null;
      const foregroundX = foreground ? gsap.quickTo(foreground, "x", { duration: 1.7, ease: "power3.out" }) : null;
      const letterSlots = nameTitle
        ? Array.from(nameTitle.querySelectorAll<HTMLElement>("[data-name-letter]"))
        : [];
      const letterMotion = letterSlots.map(() => ({ x: 0, scaleX: 1, scaleY: 1, skewX: 0 }));
      let letterCenters: number[] = [];
      let nameActive = false;
      let renderFrame = 0;
      let returnTweens: ReturnType<typeof gsap.to>[] = [];

      const renderLetters = () => {
        renderFrame = 0;
        letterSlots.forEach((slot, index) => {
          const motion = letterMotion[index];
          slot.style.transform = `translate3d(${motion.x}px, 0, 0) scaleX(${motion.scaleX}) scaleY(${motion.scaleY}) skewX(${motion.skewX}deg)`;
        });
      };

      const queueLetterRender = () => {
        if (!renderFrame) renderFrame = window.requestAnimationFrame(renderLetters);
      };

      const letterX = letterMotion.map((motion) => gsap.quickTo(motion, "x", {
        duration: 0.34,
        ease: "power3.out",
        onUpdate: queueLetterRender,
      }));
      const letterScaleX = letterMotion.map((motion) => gsap.quickTo(motion, "scaleX", {
        duration: 0.38,
        ease: "power3.out",
        onUpdate: queueLetterRender,
      }));
      const letterScaleY = letterMotion.map((motion) => gsap.quickTo(motion, "scaleY", {
        duration: 0.42,
        ease: "power3.out",
        onUpdate: queueLetterRender,
      }));
      const letterSkewX = letterMotion.map((motion) => gsap.quickTo(motion, "skewX", {
        duration: 0.42,
        ease: "power3.out",
        onUpdate: queueLetterRender,
      }));

      const onPointerMove = (event: PointerEvent) => {
        const nx = (event.clientX / window.innerWidth) * 2 - 1;
        const ny = (event.clientY / window.innerHeight) * 2 - 1;
        backgroundX(nx * 13);
        backgroundY(ny * 8);
        nameX(nx * -8);
        atmosphereX?.(nx * 18);
        foregroundX?.(nx * 5);

        if (!nameTitle) return;
        const nameBounds = nameTitle.getBoundingClientRect();
        const insideName = event.clientX >= nameBounds.left
          && event.clientX <= nameBounds.right
          && event.clientY >= nameBounds.top
          && event.clientY <= nameBounds.bottom;

        if (insideName) {
          if (!nameActive) {
            returnTweens.forEach((tween) => tween.kill());
            returnTweens = [];
            nameActive = true;
            measureLetters();
          }
          onNameMove(event);
        } else if (nameActive) {
          nameActive = false;
          onNameLeave();
        }
      };

      const measureLetters = () => {
        letterCenters = letterSlots.map((slot, index) => {
          const bounds = slot.getBoundingClientRect();
          return bounds.left + bounds.width / 2 - letterMotion[index].x;
        });
      };

      const onNameMove = (event: PointerEvent) => {
        if (letterCenters.length !== letterSlots.length) measureLetters();

        const radius = Math.min(160, Math.max(110, window.innerWidth * 0.12));
        const maxDisplacement = Math.min(72, Math.max(38, window.innerWidth * 0.045));

        letterSlots.forEach((slot, index) => {
          const deltaX = event.clientX - letterCenters[index];
          const distance = Math.abs(deltaX);
          const linearFalloff = Math.max(0, 1 - distance / radius);
          const influence = linearFalloff * linearFalloff * (3 - 2 * linearFalloff);
          const direction = Math.abs(deltaX) < 4 ? 0 : deltaX > 0 ? -1 : 1;

          letterX[index](direction * maxDisplacement * influence);
          letterScaleX[index](1 - 0.88 * influence);
          letterScaleY[index](1 + 0.1 * influence);
          letterSkewX[index](direction * -8 * influence);
        });
      };

      const onNameLeave = () => {
        nameActive = false;
        letterCenters = [];
        returnTweens.forEach((tween) => tween.kill());
        returnTweens = letterMotion.map((motion) => (
          gsap.to(motion, {
            x: 0,
            scaleX: 1,
            scaleY: 1,
            skewX: 0,
            duration: 1.05,
            ease: "elastic.out(1, 0.5)",
            overwrite: false,
            onUpdate: queueLetterRender,
          })
        ));
      };

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("blur", onNameLeave);

      return () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("blur", onNameLeave);
        if (renderFrame) window.cancelAnimationFrame(renderFrame);
        returnTweens.forEach((tween) => tween.kill());
        gsap.killTweensOf(letterMotion);
        letterSlots.forEach((slot) => slot.style.removeProperty("transform"));
      };
    },
    { scope: heroRef, dependencies: [loaderComplete], revertOnUpdate: true },
  );

  return (
    <section ref={heroRef} className={styles.hero} aria-labelledby="hero-title" data-hero>
      <div className={styles.backgroundAmbient} aria-hidden="true">
        <Image src="/media/victoria-landing.png" alt="" fill sizes="100vw" quality={45} />
      </div>

      <div className={styles.background} data-hero-background>
        <Image
          src="/media/victoria-landing.png"
          alt="Portrait of Victoria Mitsu"
          fill
          priority
          sizes="100vw"
          quality={72}
          className={styles.backgroundImage}
        />
      </div>

      <div className={styles.blueGrade} aria-hidden="true" />
      <div className={styles.atmosphere} data-hero-atmosphere aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />

      <div className={styles.nameStage} data-name-stage>
        <h1 id="hero-title" aria-label="Victoria Mitsu" data-name-title>
          <NameWord word="VICTORIA" />
          <NameWord word="MITSU" className={styles.mitsuLine} />
        </h1>
      </div>

      <div className={styles.foreground} data-hero-foreground aria-hidden="true">
        <Image
          src="/media/victoria-cutout.png"
          alt=""
          fill
          sizes="100vw"
          quality={80}
          className={styles.foregroundImage}
        />
      </div>

      <div className={styles.intro}>
        <span className={styles.introIndex}>01</span>
        <h2><span>Tech builder</span><span>Building real projects</span></h2>
      </div>

      <p className={styles.sideText}>MEDAN - INDONESIA - 2026</p>

      <div className={styles.roleRow}>
        <span className={styles.roleLine} />
        <p>AI automation &middot; web development<br />apps &middot; creative projects</p>
      </div>

      <div className={styles.bottomLeft}>
        <span>Scroll for proof</span>
        <span className={styles.scrollLine}><span /></span>
      </div>
      <div className={styles.bottomRight}><span>Portfolio / 2026</span><span>Projects / Systems</span></div>
    </section>
  );
}
