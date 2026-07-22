"use client";

import { useRef, type CSSProperties } from "react";
import { projects } from "@/data/projects";
import { TransitionLink } from "@/components/transitions/TransitionLink/TransitionLink";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./WorkIndex.module.scss";

export function WorkIndex() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const rows = gsap.utils.toArray<HTMLElement>("[data-work-row]");
      const count = root.querySelector<HTMLElement>("[data-work-count]");

      gsap.from("[data-work-index-title]", {
        yPercent: 115,
        duration: 1.3,
        ease: "power4.out",
      });

      gsap.from(rows, {
        y: 70,
        opacity: 0,
        duration: 1.1,
        stagger: 0.08,
        ease: "power4.out",
        delay: 0.25,
      });

      rows.forEach((row, index) => {
        const title = row.querySelector<HTMLElement>("[data-row-title]");
        const number = row.querySelector<HTMLElement>("[data-row-number]");

        const enter = () => {
          if (count) count.textContent = String(index + 1).padStart(2, "0");
          gsap.to(root, {
            backgroundColor: projects[index].theme.background,
            color: projects[index].theme.foreground,
            duration: 0.7,
            ease: "power3.out",
          });
          gsap.to(title, { x: 18, duration: 0.55, ease: "power4.out" });
          gsap.to(number, { x: -6, opacity: 1, duration: 0.55, ease: "power4.out" });
        };

        const leave = () => {
          gsap.to(title, { x: 0, duration: 0.55, ease: "power4.out" });
          gsap.to(number, { x: 0, opacity: 0.45, duration: 0.55, ease: "power4.out" });
        };

        row.addEventListener("pointerenter", enter);
        row.addEventListener("pointerleave", leave);

        return () => {
          row.removeEventListener("pointerenter", enter);
          row.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className={styles.root}>
      <header className={styles.header}>
        <div className={styles.titleClip}>
          <h1 data-work-index-title>WORK</h1>
        </div>
        <div className={styles.meta}>
          <span>AI, web, and STEM systems</span>
          <span><b data-work-count>01</b> / {String(projects.length).padStart(2, "0")}</span>
        </div>
      </header>

      <div className={styles.list}>
        {projects.map((project) => (
          <article
            key={project.slug}
            className={styles.row}
            data-work-row
            data-transition-scope
            style={{ "--row-accent": project.theme.accent } as CSSProperties}
          >
            <TransitionLink
              href={`/work/${project.slug}`}
              imageSrc={project.image}
              transitionLabel={project.title.join(" ")}
              transitionAccent={project.theme.accent}
              transitionBackground={project.theme.background}
              className={styles.rowLink}
              data-cursor="view"
              data-cursor-label="VIEW"
              data-cursor-preview={project.image}
            >
              <span className={styles.number} data-row-number>{project.id}</span>
              <span className={styles.title} data-row-title>{project.title.join(" ")}</span>
              <span className={styles.services}>{project.services.join(" / ")}</span>
              <span className={styles.year}>{project.year}</span>
              <span className={styles.source} data-transition-source aria-hidden="true" />
            </TransitionLink>
          </article>
        ))}
      </div>

      <footer className={styles.footer}>
        <span>Move your cursor across a project</span>
        <span>2026</span>
      </footer>
    </section>
  );
}
