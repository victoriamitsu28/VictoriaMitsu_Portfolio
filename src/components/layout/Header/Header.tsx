"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./Header.module.scss";

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
      if (reducedMotion || coarsePointer) return;

      const items = gsap.utils.toArray<HTMLElement>("[data-magnetic]");
      const cleanups = items.map((item) => {
        const moveX = gsap.quickTo(item, "x", { duration: 0.55, ease: "power3.out" });
        const moveY = gsap.quickTo(item, "y", { duration: 0.55, ease: "power3.out" });

        const onMove = (event: PointerEvent) => {
          const rect = item.getBoundingClientRect();
          const x = event.clientX - (rect.left + rect.width / 2);
          const y = event.clientY - (rect.top + rect.height / 2);
          moveX(x * 0.18);
          moveY(y * 0.18);
        };
        const onLeave = () => {
          moveX(0);
          moveY(0);
        };

        item.addEventListener("pointermove", onMove);
        item.addEventListener("pointerleave", onLeave);
        return () => {
          item.removeEventListener("pointermove", onMove);
          item.removeEventListener("pointerleave", onLeave);
        };
      });

      return () => cleanups.forEach((cleanup) => cleanup());
    },
    { scope: headerRef },
  );

  return (
    <header ref={headerRef} className={styles.header} data-header>
      <Link href="/" className={styles.identity} data-magnetic data-cursor="link" data-cursor-label="HOME">
        Victoria <span>*</span> Mitsu
      </Link>

      <nav className={styles.navigation} aria-label="Primary navigation">
        <Link href="/#services" data-magnetic data-cursor="link" data-cursor-label="SERVICES">Services</Link>
        <Link href="/#about" data-magnetic data-cursor="link" data-cursor-label="ABOUT">About</Link>
        <Link href="/" className={styles.mark} aria-label="Homepage" data-magnetic data-cursor="link" data-cursor-label="HOME">
          <Image
            src="/media/navbar-logo.png"
            alt=""
            width={32}
            height={32}
            className={styles.markLogo}
            priority
          />
        </Link>
        <Link href="/#competitions" data-magnetic data-cursor="link" data-cursor-label="ARCHIVE">Archive</Link>
        <Link href="/#experience" data-magnetic data-cursor="link" data-cursor-label="WORK">Work</Link>
      </nav>

      <div className={styles.social}>
        <a href="https://github.com/victoriamitsu28" target="_blank" rel="noreferrer" data-magnetic data-cursor="link" data-cursor-label="GITHUB">GitHub</a>
        <a href="https://www.tiktok.com/@victoriamitsu" target="_blank" rel="noreferrer" data-magnetic data-cursor="link" data-cursor-label="TIKTOK">TikTok</a>
        <a href="https://www.instagram.com/victoriamitsu" target="_blank" rel="noreferrer" data-magnetic data-cursor="link" data-cursor-label="IG">Instagram</a>
        <a href="https://www.linkedin.com/in/victoriamitsu" target="_blank" rel="noreferrer" data-magnetic data-cursor="link" data-cursor-label="LINKEDIN">LinkedIn</a>
        <a href="https://mail.google.com/mail/?view=cm&amp;fs=1&amp;to=victoria.mitsu%40gmail.com" target="_blank" rel="noreferrer" data-magnetic data-cursor="link" data-cursor-label="MAIL">Email</a>
        <a href="https://wa.me/6285929819410" target="_blank" rel="noreferrer" data-magnetic data-cursor="link" data-cursor-label="WHATSAPP">WhatsApp</a>
      </div>

      <button
        type="button"
        className={styles.menuButton}
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
        onClick={() => setMenuOpen((value) => !value)}
      >
        <span>{menuOpen ? "Close" : "Menu"}</span>
        <span className={styles.menuDot} aria-hidden="true" />
      </button>

      <div
        id="mobile-navigation"
        className={styles.mobileMenu}
        data-open={menuOpen ? "true" : "false"}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile navigation" className={styles.mobileNav}>
          <Link href="/" onClick={() => setMenuOpen(false)}>Home <span>01</span></Link>
          <Link href="/#services" onClick={() => setMenuOpen(false)}>Services <span>02</span></Link>
          <Link href="/#experience" onClick={() => setMenuOpen(false)}>Work <span>03</span></Link>
          <Link href="/#competitions" onClick={() => setMenuOpen(false)}>Archive <span>04</span></Link>
          <Link href="/#about" onClick={() => setMenuOpen(false)}>About <span>05</span></Link>
          <a href="https://github.com/victoriamitsu28" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>GitHub <span>06</span></a>
          <a href="https://www.tiktok.com/@victoriamitsu" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>TikTok <span>07</span></a>
          <a href="https://www.instagram.com/victoriamitsu" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>Instagram <span>08</span></a>
          <a href="https://www.linkedin.com/in/victoriamitsu" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>LinkedIn <span>09</span></a>
          <a href="https://mail.google.com/mail/?view=cm&amp;fs=1&amp;to=victoria.mitsu%40gmail.com" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>Email <span>10</span></a>
          <a href="https://wa.me/6285929819410" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>WhatsApp <span>11</span></a>
        </nav>
        <div className={styles.mobileMeta}>
          <span>Indonesia</span>
          <span>Available worldwide</span>
        </div>
      </div>
    </header>
  );
}
