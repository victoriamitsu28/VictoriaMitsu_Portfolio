"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { serviceOfferings } from "@/data/services";
import styles from "./ServiceMatrix.module.scss";

export function ServiceMatrix() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion) return;

      gsap.from("[data-service-heading]", {
        yPercent: 24,
        opacity: 0,
        duration: 1.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: root,
          start: "top 76%",
          once: true,
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-service-row]").forEach((row) => {
        gsap.from(row, {
          y: 42,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: row,
            start: "top 88%",
            once: true,
          },
        });
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="services"
      className={styles.services}
      aria-labelledby="services-title"
    >
      <div className={styles.topline}>
        <span>02 / Capabilities</span>
        <span>Scoped builds / collaborations / workshops</span>
      </div>

      <div className={styles.intro} data-service-heading>
        <h2 id="services-title">
          WHAT CAN WE
          <br />
          <em>BUILD?</em>
        </h2>
        <div className={styles.introCopy}>
          <p>
            I turn ambitious ideas into technology that is clear, useful, and
            ready for the people who need it.
          </p>
          <span>Available for projects in Indonesia and worldwide.</span>
        </div>
      </div>

      <ol className={styles.list}>
        {serviceOfferings.map((service) => (
          <li key={service.id} className={styles.row} data-service-row>
            <span className={styles.index}>{service.index}</span>
            <div className={styles.name}>
              <h3>{service.title}</h3>
              <span>{service.strapline}</span>
            </div>
            <p className={styles.description}>{service.description}</p>
            <ul className={styles.capabilities} aria-label={`${service.title} capabilities`}>
              {service.capabilities.map((capability) => (
                <li key={capability}>{capability}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <div className={styles.closing}>
        <p>
          Need several disciplines in one build? I can connect product thinking,
          engineering, automation, and learning into one practical system.
        </p>
        <a
          href="mailto:victoria.mitsu@gmail.com?subject=Project%20inquiry"
          data-cursor="link"
          data-cursor-label="START"
        >
          Discuss a project
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
