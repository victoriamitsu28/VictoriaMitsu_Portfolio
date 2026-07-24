"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./ProofStack.module.scss";

const featuredAwards = [
  {
    index: "01",
    result: "SILVER",
    title: "International World GreenMech Robotics Contest",
    year: "2023",
    note: "Silver medalist and top junior-high scorer, placing ahead of the number-one senior-high-school team on the international stage.",
    field: "International robotics / mechanical systems",
    navLabel: "International robotics",
    image: "/media/competitions/greenmech-international-arena.jpg",
    imageAlt: "International World GreenMech robotics competition arena in Taiwan",
    imageFit: "cover",
  },
  {
    index: "02",
    result: "GOLD",
    title: "National GreenMech Robotics Competition",
    year: "2023",
    note: "Gold medalist at the national GreenMech robotics competition, earning the path to the international stage in Taiwan.",
    field: "National robotics / mechanical systems",
    navLabel: "National robotics",
    image: "/media/competitions/greenmech-national.jpg",
    imageAlt: "National GreenMech robotics winners receiving trophies on stage",
    imageFit: "cover",
  },
  {
    index: "03",
    result: "DELEGATE",
    title: "MERMC Indonesia & International Finals",
    year: "2024",
    note: "Finished as 2nd runner-up in the Indonesian final, then represented Indonesia at the MERMC international finals.",
    field: "Business simulation / international delegate",
    navLabel: "Business simulation",
    image: "/media/competitions/mermc-delegate.jpg",
    imageAlt: "MERMC international finals invitation sent to Victoria",
    imageFit: "contain",
  },
  {
    index: "04",
    result: "SILVER",
    title: "World Invention Competition & Exhibition",
    year: "2024",
    note: "Silver medalist at WICE for an interactive learning and knowledge-recognition project presented on the international stage.",
    field: "Invention / interactive learning",
    navLabel: "Invention",
    image: "/media/competitions/wice-silver.jpg",
    imageAlt: "Victoria holding her WICE silver medal and certificate",
    imageFit: "cover",
  },
  {
    index: "05",
    result: "2ND",
    title: "Impact 5.0 ITB",
    year: "2025",
    note: "Ranked first in informatics and finished 50+ points ahead of national and international olympiad medalists and trainees.",
    field: "Informatics / interdisciplinary problem solving",
    navLabel: "Informatics",
    image: "/media/competitions/impact-itb-team.jpg",
    imageAlt: "Victoria and her team at Institut Teknologi Bandung for Impact 5.0",
    imageFit: "cover",
  },
];

export function ProofStack() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion) return;

      gsap.from("[data-awards-intro]", {
        y: 60,
        opacity: 0,
        duration: 1.1,
        stagger: 0.08,
        ease: "power4.out",
        scrollTrigger: { trigger: root, start: "top 76%", once: true },
      });

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-featured-award]");
        const stage = root.querySelector<HTMLElement>("[data-awards-stage]");
        const navItems = gsap.utils.toArray<HTMLElement>("[data-award-nav]");
        const progressSteps = gsap.utils.toArray<HTMLElement>("[data-award-step]");
        const counter = root.querySelector<HTMLElement>("[data-award-current]");
        if (!stage || cards.length === 0) return;

        let activeIndex = -1;
        const updateAwardState = (index: number) => {
          if (index === activeIndex) return;
          activeIndex = index;
          navItems.forEach((item, itemIndex) => item.toggleAttribute("data-active", itemIndex === index));
          progressSteps.forEach((step, stepIndex) => step.toggleAttribute("data-active", stepIndex <= index));
          if (counter) counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
        };

        gsap.set(cards, {
          opacity: 0,
          visibility: "visible",
          yPercent: 12,
          scale: 1.015,
          clipPath: "inset(100% 0 0 0 round 1.75rem)",
          transformPerspective: 1400,
          transformOrigin: "center top",
          force3D: true,
        });
        gsap.set(cards[0], { opacity: 1, visibility: "visible", yPercent: 0, scale: 1, clipPath: "inset(0% 0% 0% 0% round 1.75rem)" });
        updateAwardState(0);

        gsap.from(cards[0].querySelectorAll("[data-award-copy]"), {
          y: 34,
          opacity: 0,
          duration: 0.85,
          stagger: 0.06,
          ease: "power4.out",
          scrollTrigger: { trigger: stage, start: "top 72%", once: true },
        });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${window.innerHeight * (cards.length - 1) * 1.08}`,
            pin: true,
            scrub: 1.15,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: {
              snapTo: 1 / (cards.length - 1),
              directional: false,
              inertia: false,
              duration: { min: 0.28, max: 0.7 },
              delay: 0.08,
              ease: "power2.inOut",
            },
            onUpdate: (self) => updateAwardState(Math.round(self.progress * (cards.length - 1))),
          },
        });

        for (let index = 1; index < cards.length; index += 1) {
          const previous = cards[index - 1];
          const next = cards[index];
          const nextMedia = next.querySelector<HTMLElement>("[data-award-image]");
          const nextImage = next.querySelector<HTMLElement>("[data-award-image] img");
          const nextCopy = next.querySelectorAll("[data-award-copy]");
          const nextNumber = next.querySelector<HTMLElement>("[data-award-number]");
          const position = index - 1;

          timeline
            .to(previous, {
              yPercent: -3,
              scale: 0.965,
              opacity: 0,
              filter: "blur(14px)",
              duration: 0.58,
              ease: "power3.in",
            }, position)
            .set(next, { opacity: 1, visibility: "visible" }, position)
            .fromTo(next,
              { yPercent: 12, scale: 1.015, clipPath: "inset(100% 0 0 0 round 1.75rem)" },
              { yPercent: 0, scale: 1, clipPath: "inset(0% 0% 0% 0% round 1.75rem)", duration: 0.88, ease: "power4.inOut" },
              position,
            )
            .fromTo(nextCopy,
              { y: 28, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.55, stagger: 0.05, ease: "power4.out" },
              position + 0.32,
            );

          if (nextMedia) {
            timeline.fromTo(nextMedia,
              { clipPath: "inset(0 0 0 100%)" },
              { clipPath: "inset(0 0 0 0%)", duration: 0.72, ease: "power4.inOut" },
              position + 0.18,
            );
          }

          if (nextImage) {
            timeline.fromTo(nextImage,
              { scale: 1.18, xPercent: 4, filter: "saturate(0.35) contrast(1.14) brightness(0.7)" },
              { scale: 1.02, xPercent: 0, filter: "saturate(0.78) contrast(1.08) brightness(0.82)", duration: 1.05, ease: "power3.out" },
              position + 0.12,
            );
          }

          if (nextNumber) {
            timeline.fromTo(nextNumber,
              { xPercent: 12, opacity: 0 },
              { xPercent: 0, opacity: 0.055, duration: 0.7, ease: "power4.out" },
              position + 0.28,
            );
          }
        }
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className={styles.proof} id="competitions" aria-labelledby="competition-title">
      <header className={styles.intro}>
        <div className={styles.topline} data-awards-intro>
          <span>03 / Competition Record</span>
          <span>Robotics, AI, informatics, business</span>
        </div>
        <h2 id="competition-title" data-awards-intro>
          BUILT TO COMPETE.<br /><em>TRAINED TO SHIP.</em>
        </h2>
        <div className={styles.introCopy} data-awards-intro>
          <strong>31 results</strong>
          <p>Five defining stages up front. Explore the full record by field in the interactive archive that follows.</p>
        </div>
      </header>

      <div className={styles.stage} data-awards-stage>
        <div className={styles.stageLabel} aria-hidden="true">SELECTED HONORS / 2023-2025</div>
        <div className={styles.showcase}>
          <div className={styles.awardNav} aria-hidden="true">
            {featuredAwards.map((award, index) => (
              <span key={award.index} className={styles.awardNavItem} data-award-nav data-active={index === 0 ? "" : undefined}>
                <b>{award.index}</b>
                <span>{award.navLabel}</span>
                <i />
              </span>
            ))}
          </div>

          <div className={styles.awardViewport}>
            {featuredAwards.map((award, index) => (
              <article
                key={award.index}
                className={styles.awardCard}
                data-featured-award
                data-theme={index}
                style={{ "--award-order": index } as CSSProperties}
              >
            <div className={styles.cardTop}>
              <span>{award.index} / 05</span>
              <span>{award.field}</span>
              <span>{award.year}</span>
            </div>

            <div className={styles.cardHeadline}>
              <h3 data-award-copy>{award.title}</h3>
              <div className={styles.resultMeta} data-award-copy>
                <span>Result</span>
                <strong>{award.result}</strong>
              </div>
            </div>

            <div className={styles.cardBottom}>
              <p data-award-copy>{award.note}</p>
              <Link href="/#achievement-index-title">
                View full record <span aria-hidden="true">↗</span>
              </Link>
            </div>

            <figure
              className={`${styles.awardMedia} ${award.imageFit === "contain" ? styles.awardMediaContain : ""}`}
              data-award-image
            >
              <Image
                src={award.image}
                alt={award.imageAlt}
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1024px) 48vw, 34vw"
                quality={70}
              />
              <figcaption>{award.result} / {award.year}</figcaption>
            </figure>

            <span className={styles.cardIndex} data-award-number aria-hidden="true">{award.index}</span>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.showcaseStatus}>
          <span data-award-current aria-live="polite">01 / 05</span>
          <div className={styles.showcaseRail} aria-hidden="true">
            {featuredAwards.map((award, index) => <i key={award.index} data-award-step data-active={index === 0 ? "" : undefined} />)}
          </div>
          <span>Scroll to explore</span>
        </div>
      </div>
    </section>
  );
}
