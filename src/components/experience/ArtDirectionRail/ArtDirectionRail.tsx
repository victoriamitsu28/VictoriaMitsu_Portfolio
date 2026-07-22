"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./ArtDirectionRail.module.scss";

const words = ["WEB", "CODE", "ROBOTICS", "STEM", "MOTION", "IMPACT"];

export function ArtDirectionRail() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion) return;

      const trackA = root.querySelector<HTMLElement>("[data-rail-a]");
      const trackB = root.querySelector<HTMLElement>("[data-rail-b]");
      const statement = root.querySelector<HTMLElement>("[data-rail-statement]");

      if (trackA) {
        gsap.fromTo(trackA, { xPercent: 0 }, {
          xPercent: -28,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 1.1 },
        });
      }

      if (trackB) {
        gsap.fromTo(trackB, { xPercent: -24 }, {
          xPercent: 4,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 1.1 },
        });
      }

      if (statement) {
        gsap.from(statement, {
          yPercent: 45,
          opacity: 0,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: { trigger: statement, start: "top 80%", once: true },
        });
      }
    },
    { scope: rootRef },
  );

  const rail = [...words, ...words, ...words];

  return (
    <section ref={rootRef} id="about" className={styles.root} aria-label="About Victoria's work">
      <div className={styles.meta}>
        <span>Built across disciplines</span>
        <span>Web / robotics / product / leadership</span>
      </div>

      <div className={styles.rail} aria-hidden="true">
        <div className={styles.track} data-rail-a>
          {rail.map((word, index) => <span key={`a-${word}-${index}`}>{word}<i>*</i></span>)}
        </div>
      </div>

      <div className={`${styles.rail} ${styles.railOutline}`} aria-hidden="true">
        <div className={styles.track} data-rail-b>
          {rail.map((word, index) => <span key={`b-${word}-${index}`}>{word}<i>*</i></span>)}
        </div>
      </div>

      <p className={styles.statement} data-rail-statement>
        I enjoy taking a rough idea, figuring out what people actually need,
        and turning it into something clear, useful, and ready to use.
      </p>
    </section>
  );
}
