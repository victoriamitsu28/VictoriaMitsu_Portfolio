"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { WebGLProjectImage } from "@/components/webgl/WebGLProjectImage/WebGLProjectImage";
import type { Project } from "@/data/projects";
import { TransitionLink } from "@/components/transitions/TransitionLink/TransitionLink";
import { useAppStore } from "@/store/useAppStore";
import { DraggableRail } from "@/components/interactions/DraggableRail/DraggableRail";
import styles from "./ProjectCaseStudy.module.scss";

type Props = { project: Project; nextProject: Project };

export function ProjectCaseStudy({ project, nextProject }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const transitionActive = useAppStore((state) => state.transitionActive);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || transitionActive) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const heroLines = gsap.utils.toArray<HTMLElement>("[data-case-title-line]");
        const heroMeta = gsap.utils.toArray<HTMLElement>("[data-case-hero-meta]");
        const heroMedia = root.querySelector<HTMLElement>("[data-case-hero-media]");

        gsap.timeline({ defaults: { ease: "power4.out" } })
          .from(heroLines, { yPercent: 115, duration: 1.35, stagger: 0.1 }, 0.15)
          .from(heroMeta, { y: 30, opacity: 0, duration: 0.9, stagger: 0.06 }, 0.55)
          .fromTo(heroMedia,
            { clipPath: "inset(12% 8% 12% 8% round 1rem)", scale: 1.08 },
            { clipPath: "inset(0% 0% 0% 0% round 0rem)", scale: 1, duration: 1.6, ease: "power3.inOut" },
            0.55,
          );

        gsap.to("[data-case-hero-image]", {
          yPercent: 10,
          ease: "none",
          scrollTrigger: { trigger: "[data-case-hero-media]", start: "top top", end: "bottom top", scrub: true },
        });

        gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
          const items = group.querySelectorAll("[data-reveal]");
          gsap.from(items, {
            y: 65,
            opacity: 0,
            duration: 1.15,
            stagger: 0.08,
            ease: "power4.out",
            scrollTrigger: { trigger: group, start: "top 78%", once: true },
          });
        });

        gsap.fromTo("[data-desktop-showcase]",
          { scale: 0.88, borderRadius: "2rem" },
          {
            scale: 1,
            borderRadius: "0rem",
            ease: "none",
            scrollTrigger: { trigger: "[data-desktop-section]", start: "top bottom", end: "center center", scrub: true },
          },
        );

        gsap.utils.toArray<HTMLElement>("[data-detail-image]").forEach((item, index) => {
          gsap.from(item, {
            y: index % 2 === 0 ? 100 : 160,
            opacity: 0,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: { trigger: item, start: "top 85%", once: true },
          });
        });

        gsap.from("[data-mobile-device]", {
          y: 180,
          rotation: (index) => (index - 1) * 5,
          opacity: 0,
          duration: 1.4,
          stagger: 0.12,
          ease: "power4.out",
          scrollTrigger: { trigger: "[data-mobile-stage]", start: "top 75%", once: true },
        });

        gsap.fromTo("[data-next-image]",
          { scale: 1.12 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: "[data-next-project]", start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [transitionActive], revertOnUpdate: true },
  );

  return (
    <article
      ref={rootRef}
      className={styles.caseStudy}
      style={{
        "--project-bg": project.theme.background,
        "--project-fg": project.theme.foreground,
        "--project-accent": project.theme.accent,
        "--project-surface": project.theme.surface,
        "--project-muted": project.theme.muted,
      } as CSSProperties}
    >
      <section className={styles.heroIntro}>
        <div className={styles.heroEyebrow} data-case-hero-meta>
          <span>Project {project.id}</span>
          <span>{project.caseStudy.eyebrow}</span>
          <span>{project.year}</span>
        </div>

        <h1 className={styles.heroTitle} aria-label={project.title.join(" ")}>
          {project.title.map((line) => (
            <span key={line} className={styles.titleClip}>
              <span data-case-title-line>{line}</span>
            </span>
          ))}
        </h1>

        <div className={styles.heroFooter}>
          <p data-case-hero-meta>{project.caseStudy.intro}</p>
          <div className={styles.heroServices} data-case-hero-meta>
            {project.services.map((service) => <span key={service}>{service}</span>)}
          </div>
        </div>
      </section>

      <section className={styles.heroMedia} data-case-hero-media data-transition-target>
        <div className={styles.heroImageLayer} data-case-hero-image>
          <WebGLProjectImage
            src={project.caseStudy.heroImage}
            alt={`${project.client} website`}
            sizes="100vw"
            priority
            accent={project.theme.shaderAccent}
          />
        </div>
      </section>

      <section className={styles.overview} data-reveal-group>
        <div className={styles.sectionLabel} data-reveal><span>01</span><span>Overview</span></div>
        <p className={styles.overviewText} data-reveal>{project.caseStudy.overview}</p>
        <div className={styles.projectFacts}>
          <div data-reveal><span>Client</span><p>{project.client}</p></div>
          <div data-reveal><span>Location</span><p>{project.location}</p></div>
          <div data-reveal><span>Year</span><p>{project.year}</p></div>
        </div>
      </section>

      <section className={styles.wideVisual}>
        <Image src={project.caseStudy.overviewImage} alt="Project interface overview" fill sizes="100vw" className={styles.coverImage} />
      </section>

      <section className={styles.story} data-reveal-group>
        <div className={styles.sectionLabel} data-reveal><span>02</span><span>Challenge</span></div>
        <div className={styles.storyContent}>
          <h2 data-reveal>Turning complexity into clarity.</h2>
          <p data-reveal>{project.caseStudy.challenge}</p>
        </div>
      </section>

      <section className={styles.desktopSection} data-desktop-section>
        <div className={styles.desktopShowcase} data-desktop-showcase>
          <Image src={project.caseStudy.desktopImage} alt="Desktop website interface" fill sizes="100vw" className={styles.containImage} />
        </div>
      </section>

      <section className={styles.story} data-reveal-group>
        <div className={styles.sectionLabel} data-reveal><span>03</span><span>Approach</span></div>
        <div className={styles.storyContent}>
          <h2 data-reveal>Design around the real workflow.</h2>
          <p data-reveal>{project.caseStudy.approach}</p>
        </div>
      </section>

      <section className={styles.artDirection} data-reveal-group>
        <div className={styles.sectionLabel} data-reveal><span>04</span><span>Art Direction</span></div>
        <div className={styles.artDirectionBody}>
          <p data-reveal>{project.caseStudy.artDirection}</p>
          <ol>
            {project.caseStudy.designPrinciples.map((principle, index) => (
              <li key={principle} data-reveal>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{principle}</strong>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.details}>
        {project.caseStudy.detailImages.map((image, index) => (
          <div key={image} className={index === 0 ? styles.detailLarge : styles.detailSmall} data-detail-image>
            <Image src={image} alt={`Interface detail ${index + 1}`} fill sizes={index === 0 ? "70vw" : "45vw"} className={styles.coverImage} />
          </div>
        ))}
      </section>

      <section className={styles.mobileSection}>
        <header className={styles.mobileHeader} data-reveal-group>
          <div className={styles.sectionLabel} data-reveal><span>05</span><span>Mobile</span></div>
          <h2 data-reveal>Designed to stay clear at every size.</h2>
        </header>
        <DraggableRail className={styles.mobileStage}>
          <div data-mobile-stage className={styles.mobileTrack}>
            {project.caseStudy.mobileImages.map((image) => (
              <div key={image} className={styles.mobileDevice} data-mobile-device>
                <Image src={image} alt="Mobile website interface" fill sizes="(max-width: 767px) 70vw, 25vw" className={styles.mobileImage} />
              </div>
            ))}
          </div>
        </DraggableRail>
      </section>

      <section className={styles.system} data-reveal-group>
        <div className={styles.sectionLabel} data-reveal><span>06</span><span>System</span></div>
        <div className={styles.systemGrid}>
          <div className={styles.stackBlock} data-reveal>
            <span>Technology</span>
            <ul>{project.caseStudy.stack.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div className={styles.colorBlock} data-reveal>
            <span>Color Palette</span>
            <div className={styles.swatches}>
              {project.caseStudy.colors.map((color) => (
                <div key={color} className={styles.swatch} style={{ backgroundColor: color }}><span>{color}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.result} data-reveal-group>
        <div className={styles.sectionLabel} data-reveal><span>07</span><span>Result</span></div>
        <p data-reveal>{project.caseStudy.result}</p>
        {project.caseStudy.website && (
          <a href={project.caseStudy.website} target="_blank" rel="noreferrer" className={styles.websiteLink} data-reveal data-cursor="link" data-cursor-label="VISIT">
            Visit live website <span>OPEN</span>
          </a>
        )}
      </section>

      <section className={styles.nextProject} data-next-project data-transition-scope>
        <TransitionLink
          href={`/work/${nextProject.slug}`}
          imageSrc={nextProject.image}
          transitionLabel={nextProject.title.join(" ")}
          transitionAccent={nextProject.theme.accent}
          transitionBackground={nextProject.theme.background}
          className={styles.nextLink}
          data-cursor="view"
          data-cursor-label="NEXT"
        >
          <div className={styles.nextImage} data-next-image data-transition-source>
            <Image src={nextProject.image} alt={`${nextProject.client} project preview`} fill sizes="100vw" className={styles.coverImage} />
            <div className={styles.nextShade} />
          </div>
          <div className={styles.nextContent}>
            <span>Next project</span>
            <h2>{nextProject.title.join(" ")}</h2>
            <span className={styles.nextArrow}>OPEN</span>
          </div>
        </TransitionLink>
      </section>
    </article>
  );
}
