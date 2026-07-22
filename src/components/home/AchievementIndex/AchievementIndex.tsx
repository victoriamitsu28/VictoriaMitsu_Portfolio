"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { achievementCatalog } from "@/data/achievementCatalog";
import { gsap } from "@/lib/gsap";
import styles from "./AchievementIndex.module.scss";

export function AchievementIndex() {
  const resultsRef = useRef<HTMLOListElement>(null);
  const hoverTimerRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeDiscipline = achievementCatalog[activeIndex];

  const clearPendingHover = () => {
    if (hoverTimerRef.current === null) return;
    window.clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = null;
  };

  const selectDiscipline = (index: number) => {
    clearPendingHover();
    setActiveIndex(index);
  };

  const queueDiscipline = (index: number) => {
    clearPendingHover();
    if (index === activeIndex) return;
    hoverTimerRef.current = window.setTimeout(() => {
      setActiveIndex(index);
      hoverTimerRef.current = null;
    }, 90);
  };

  useEffect(() => () => {
    if (hoverTimerRef.current !== null) window.clearTimeout(hoverTimerRef.current);
  }, []);

  useEffect(() => {
    const results = resultsRef.current;
    if (!results) return;
    const rows = Array.from(results.children);
    gsap.killTweensOf(rows);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(rows, { clearProps: "opacity,transform" });
      return;
    }

    const tween = gsap.fromTo(
      rows,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.48, stagger: 0.035, ease: "power3.out", overwrite: "auto" },
    );

    return () => {
      tween.kill();
    };
  }, [activeIndex]);

  return (
    <section className={styles.index} aria-labelledby="achievement-index-title">
      <header className={styles.heading}>
        <div className={styles.topline}>
          <span>02B / Achievement archive</span>
          <span>Five disciplines / 31 results</span>
        </div>
        <h2 id="achievement-index-title">THE FIELDS<br />OF PLAY.</h2>
        <p>Every competition result, grouped by field. Choose a discipline to read the full record, then enter its media archive.</p>
      </header>

      <div className={styles.explorer}>
        <div className={styles.tabs} role="tablist" aria-label="Achievement disciplines">
          {achievementCatalog.map((discipline, index) => (
            <button
              key={discipline.slug}
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              aria-controls="achievement-results"
              data-active={activeIndex === index ? "true" : "false"}
              onClick={() => selectDiscipline(index)}
              onPointerEnter={(event) => {
                if (event.pointerType !== "touch") queueDiscipline(index);
              }}
              onPointerLeave={clearPendingHover}
              onFocus={() => selectDiscipline(index)}
            >
              <span>{discipline.number}</span>
              <strong>{discipline.title}</strong>
              <em>{discipline.records.length} results</em>
              <i aria-hidden="true">+</i>
            </button>
          ))}
        </div>

        <div className={styles.results} id="achievement-results" role="tabpanel">
          <div className={styles.resultsHeader}>
            <div>
              <span>{activeDiscipline.number} / 05</span>
              <span>{activeDiscipline.records.length} verified results</span>
            </div>
            <h3>{activeDiscipline.title}</h3>
            <p>{activeDiscipline.summary}</p>
          </div>

          <ol ref={resultsRef} className={styles.resultList}>
            {activeDiscipline.records.map((record, index) => (
              <li key={`${record.title}-${record.year}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{record.result}</strong>
                <p>{record.title}</p>
                <time>{record.year}</time>
              </li>
            ))}
          </ol>

          <Link
            href="/#competitions"
            className={styles.openLink}
            data-cursor="link"
            data-cursor-label="OPEN"
          >
            Return to the Competition Record <span aria-hidden="true">&uarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
