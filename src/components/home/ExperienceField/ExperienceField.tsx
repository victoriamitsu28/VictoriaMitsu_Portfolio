"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./ExperienceField.module.scss";

const builds = [
  {
    index: "01",
    name: "Chery Medan Amplas",
    label: "Automotive web / SEO / performance",
    description: "Frontend features, responsive systems, technical SEO, page speed, analytics readiness, and a clearer path from model discovery to sales contact.",
    status: "Live",
    href: "https://cherymedanamplas.com",
    visual: "chery",
  },
  {
    index: "02",
    name: "SSEC Sutomo 1",
    label: "STEM platform / research showcase",
    description: "A digital home for student science activities, experiment documentation, research showcases, and the workflows that keep a technical club moving.",
    status: "Live",
    href: "https://ssec-sutomo1.vercel.app",
    visual: "ssec",
  },
  {
    index: "03",
    name: "Vorce",
    label: "Workforce intelligence / mobile + web",
    description: "A collaboration and workforce platform spanning real-time maps, attendance, tasks, chat, voice capture, operational visibility, and mobile field work.",
    status: "Published",
    href: "https://vorce.id",
    visual: "vorce",
  },
  {
    index: "04",
    name: "SUM AI",
    label: "Summary / speech / live translation",
    description: "An upcoming AI assistant that turns speech, meetings, and multilingual conversations into live translation, concise summaries, and decisions people can act on.",
    status: "In development",
    visual: "sum",
  },
];

const roles = [
  ["2025-now", "Chief Digital Officer & Co-founder", "HORA", "AI monitoring, device intelligence, workforce tooling, live translation, summaries, alerts, and operational analytics."],
  ["2025-now", "Development Team", "UNDP ICPSD", "Interactive web mapping, geospatial data, JavaScript, Leaflet, GIS, accessibility testing, and international collaboration."],
  ["2026-now", "Software Engineer", "Chery Automotive", "Responsive frontend engineering, technical SEO, performance, metadata, indexing readiness, and analytics integration."],
  ["2025-now", "Lead Developer", "SEALNet", "Digital platforms and technical systems supporting student STEM activities and research showcases."],
  ["2025-now", "Lead Developer", "Sutomo 1 Science Exploration Club", "Engineering tools, experiment workflows, documentation, and practical development for student research."],
  ["2025-now", "Problem Setter", "SMA Sutomo 1", "NOI-style competitive programming problems, rigorous test data, edge cases, difficulty balancing, and national-standard assessments."],
  ["2024", "Science Mentor", "PPSN / Saturnus", "Government-supported STEM mentoring for public-school students in Medan."],
  ["2024", "English Mentor", "Project Ivy", "Cross-border Singapore-Indonesia mentoring focused on education access, collaboration, and youth leadership."],
  ["2024", "Python Programming Mentor", "STEM is Us", "Python and STEM sessions for 2,000+ participants across 20+ countries."],
  ["2025", "Chapter President", "Generation Girl Indonesia", "Co-led programs reaching 30,000+ women, guided 100+ students, and helped 13 teams ship original game projects."],
  ["2023-2025", "Lead of Human Resources", "Aspiring Change Makers", "STEM and entrepreneurship programs for 300+ underprivileged students, with IDR 8.5M+ in combined impact and revenue."],
  ["2024", "Invited Guest", "DAAI TV Medan", "Featured on broadcast to present student-led initiatives and coordinate professional media engagement."],
  ["2023-2024", "President", "Student Council", "Represented 2,000+ students and helped run competitions, camps, expos, and events reaching roughly 10,000 participants."],
  ["Community", "Invited Contributor", "Lions Clubs Medan", "Supported a cataract surgery program that restored sight through approximately 70 procedures in one day."],
  ["2016-2019", "Owner", "Uniq Shop", "A school microbusiness covering sourcing, importing, pricing, sales, customer communication, and weekly profitability."],
];

const desktopRolesPerPage = 5;

const ledgerPages = [
  ["Build / Systems", "Products, platforms, and engineering"],
  ["Teach / Contribute", "Mentoring, education, and community"],
  ["Lead / Enterprise", "Organizations, media, and entrepreneurship"],
] as const;

function BuildVisual({ visual }: { visual: string }) {
  if (visual === "chery") {
    return (
      <div className={`${styles.visual} ${styles.cheryVisual}`}>
        <Image
          src="/media/work/chery.jpg"
          alt="Chery Medan Amplas website"
          fill
          sizes="(max-width: 767px) 82vw, (max-width: 1024px) 68vw, 58vw"
          quality={68}
        />
        <span className={styles.visualStamp}>LIVE / MEDAN</span>
      </div>
    );
  }

  if (visual === "ssec") {
    return (
      <div className={`${styles.visual} ${styles.ssecVisual}`} aria-label="Animated SSEC research system">
        <div className={styles.ssecWord}>SSEC</div>
        <div className={styles.orbit}><span /><span /><span /></div>
        <div className={styles.ssecMeta}><span>RESEARCH</span><span>BUILD</span><span>SHARE</span></div>
      </div>
    );
  }

  if (visual === "vorce") {
    return (
      <div className={`${styles.visual} ${styles.vorceVisual}`} aria-label="Animated Vorce product interface">
        <div className={styles.phone}>
          <div className={styles.phoneTop}><strong>VORCE</strong><span>09:41</span></div>
          <div className={styles.mapGrid}><i /><i /><i /></div>
          <div className={styles.taskRows}><span>Team online <b>18</b></span><span>Tasks moving <b>42</b></span><span>Live alerts <b>03</b></span></div>
        </div>
        <div className={styles.signalRing}><span /></div>
      </div>
    );
  }

  return (
    <div className={`${styles.visual} ${styles.sumVisual}`} aria-label="Animated AI transcript and summary interface">
      <div className={styles.waveform}>{Array.from({ length: 28 }, (_, index) => <i key={index} style={{ "--bar": (index % 7) + 2 } as CSSProperties} />)}</div>
      <div className={styles.transcript}><span>LIVE TRANSCRIPT / ID - EN</span><p>We need one clear decision before the next sprint.</p><strong>SUMMARY READY</strong></div>
      <div className={styles.summaryLines}><i /><i /><i /></div>
    </div>
  );
}

export function ExperienceField() {
  const rootRef = useRef<HTMLElement>(null);
  const ledgerListRef = useRef<HTMLOListElement>(null);
  const [rolePage, setRolePage] = useState(0);
  const [rolesPerPage, setRolesPerPage] = useState(desktopRolesPerPage);
  const rolePageCount = Math.ceil(roles.length / rolesPerPage);
  const visibleRoles = roles.slice(rolePage * rolesPerPage, (rolePage + 1) * rolesPerPage);
  const ledgerCategoryIndex = Math.floor((rolePage * rolesPerPage) / desktopRolesPerPage);
  const activeLedgerPage = ledgerPages[Math.min(ledgerCategoryIndex, ledgerPages.length - 1)];

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const updatePageSize = () => {
      setRolesPerPage(media.matches ? 3 : desktopRolesPerPage);
      setRolePage(0);
    };

    updatePageSize();
    media.addEventListener("change", updatePageSize);
    return () => media.removeEventListener("change", updatePageSize);
  }, []);

  useEffect(() => {
    const list = ledgerListRef.current;
    if (!list || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.fromTo(
      list.children,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, stagger: 0.045, ease: "power3.out" },
    );
  }, [rolePage, rolesPerPage]);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion) return;

      gsap.from("[data-experience-intro]", {
        y: 64,
        opacity: 0,
        duration: 1.1,
        stagger: 0.07,
        ease: "power4.out",
        scrollTrigger: { trigger: root, start: "top 76%", once: true },
      });

      gsap.from("[data-ledger-close]", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-role-ledger]", start: "bottom 94%", once: true },
      });

      gsap.from("[data-ledger-intro] > *", {
        y: 34,
        opacity: 0,
        duration: 0.85,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-role-ledger]", start: "top 72%", once: true },
      });

      gsap.from("[data-ledger-panel]", {
        x: 54,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-role-ledger]", start: "top 68%", once: true },
      });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1px)", () => {
        const viewport = root.querySelector<HTMLElement>("[data-build-viewport]");
        const track = root.querySelector<HTMLElement>("[data-build-track]");
        if (!viewport || !track) return;

        const horizontalDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        gsap.to(track, {
          x: () => -horizontalDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: viewport,
            start: "top top",
            end: () => `+=${Math.max(horizontalDistance(), window.innerHeight * 1.25)}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className={styles.experience} id="experience" aria-labelledby="experience-title">
      <header className={styles.intro}>
        <div className={styles.topline} data-experience-intro><span>03 / Experience</span><span>Products, platforms, teams</span></div>
        <h2 id="experience-title" data-experience-intro>WORK THAT<br /><em>ACTUALLY MOVES.</em></h2>
        <p data-experience-intro>From an automotive sales platform to field-work intelligence and multilingual AI, the work lives across screens, teams, and real operations.</p>
      </header>

      <div className={styles.buildViewport} data-build-viewport>
        <div className={styles.buildTrack} data-build-track>
          <div className={styles.trackTitle} aria-hidden="true"><span>FEATURED</span><strong>BUILDS</strong></div>
          {builds.map((build) => {
            const cardContent = (
              <>
              <div className={styles.buildMeta}><span>{build.index} / 04</span><span>{build.status}</span></div>
              <BuildVisual visual={build.visual} />
              <div className={styles.buildCopy}>
                <span>{build.label}</span>
                <h3>{build.name}</h3>
                <p>{build.description}</p>
                <div className={styles.buildLinks}>
                  {build.href ? <span>Open live project <b aria-hidden="true">↗</b></span> : <span>Ongoing / publishing later</span>}
                </div>
              </div>
              </>
            );

            return build.href ? (
              <a
                key={build.name}
                className={styles.buildCard}
                href={build.href}
                target="_blank"
                rel="noreferrer"
                data-cursor="link"
                data-cursor-label="OPEN"
                aria-label={`Open ${build.name} live project`}
              >
                {cardContent}
              </a>
            ) : (
              <article key={build.name} className={`${styles.buildCard} ${styles.buildCardOngoing}`}>
                {cardContent}
              </article>
            );
          })}
        </div>
      </div>

      <section
        className={styles.ledger}
        data-role-ledger
        aria-labelledby="role-title"
        style={{ "--ledger-progress": `${((rolePage + 1) / rolePageCount) * 100}%` } as CSSProperties}
      >
        <div className={styles.ledgerIntro} data-ledger-intro>
          <div className={styles.ledgerEyebrow}>
            <span>Experience ledger / 15 roles</span>
            <span>{String(rolePage + 1).padStart(2, "0")} / {String(rolePageCount).padStart(2, "0")}</span>
          </div>
          <h3 id="role-title" aria-label="The longer version">
            <span>THE</span>
            <span>LONGER</span>
            <em>VERSION.</em>
          </h3>
          <p>Engineering, open-source development, technical leadership, mentoring, problem setting, and entrepreneurship.</p>
          <dl className={styles.ledgerMetrics}>
            <div><dt>Roles</dt><dd>15</dd></div>
            <div><dt>Years active</dt><dd>10</dd></div>
            <div><dt>Disciplines</dt><dd>05</dd></div>
          </dl>
        </div>
        <div className={styles.ledgerPanel} data-ledger-panel>
          <div className={styles.ledgerControls}>
            <div className={styles.pageContext}>
              <span>{activeLedgerPage[0]}</span>
              <strong>{activeLedgerPage[1]}</strong>
            </div>
            <div className={styles.pageSelector} aria-label="Experience pages">
              <button
                type="button"
                onClick={() => setRolePage((current) => (current - 1 + rolePageCount) % rolePageCount)}
                aria-label="Previous experience page"
              >
                <span aria-hidden="true">←</span>
              </button>
              {Array.from({ length: rolePageCount }, (_, pageIndex) => (
                <button
                  key={pageIndex}
                  type="button"
                  data-active={pageIndex === rolePage ? "true" : "false"}
                  aria-current={pageIndex === rolePage ? "page" : undefined}
                  aria-label={`Experience page ${pageIndex + 1}`}
                  onClick={() => setRolePage(pageIndex)}
                >
                  {String(pageIndex + 1).padStart(2, "0")}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setRolePage((current) => (current + 1) % rolePageCount)}
                aria-label="Next experience page"
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
          <div className={styles.ledgerProgress} aria-hidden="true"><span /></div>
          <div className={styles.ledgerColumns} aria-hidden="true">
            <span>No.</span>
            <span>Period</span>
            <span>Role / Organisation</span>
            <span>Scope and impact</span>
          </div>
          <ol ref={ledgerListRef} aria-label={`Experience page ${rolePage + 1} of ${rolePageCount}`}>
          {visibleRoles.map(([date, role, organization, detail], index) => {
            const roleIndex = rolePage * rolesPerPage + index;
            return (
            <li key={`${organization}-${role}`} data-role-row>
              <span>{String(roleIndex + 1).padStart(2, "0")}</span>
              <time>{date}</time>
              <div><strong>{role}</strong><em>{organization}</em></div>
              <p>{detail}</p>
            </li>
            );
          })}
          </ol>
        </div>
        <footer className={styles.ledgerClose} data-ledger-close>
          <div>
            <span>Ledger complete</span>
            <strong>2016 / Now</strong>
          </div>
          <p>Engineering, leadership, education, and entrepreneurship in one continuous practice.</p>
          <a href="#contact">
            Continue to contact
            <span aria-hidden="true">↘</span>
          </a>
        </footer>
      </section>
    </section>
  );
}
