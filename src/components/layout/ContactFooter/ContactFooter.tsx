import Link from "next/link";
import styles from "./ContactFooter.module.scss";

export function ContactFooter() {
  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.kicker}>
        <span>Open to ambitious builds</span>
        <span>Software products / STEM platforms / creative web systems</span>
      </div>

      <div className={styles.ctaWrap}>
        <a
          className={styles.cta}
          href="https://mail.google.com/mail/?view=cm&amp;fs=1&amp;to=victoria.mitsu%40gmail.com"
          target="_blank"
          rel="noreferrer"
          data-cursor="link"
          data-cursor-label="MAIL"
        >
          BUILD THE
          <br />
          NEXT SIGNAL.
          <span aria-hidden="true">OPEN</span>
        </a>
      </div>

      <div className={styles.bottom}>
        <div className={styles.identity}>
          <strong>Victoria Mitsu</strong>
          <span>Software engineer, product builder, creative maker</span>
        </div>

        <nav aria-label="Footer navigation" className={styles.nav}>
          <Link href="/">Home</Link>
          <Link href="/#experience">Work</Link>
          <Link href="/#competitions">Archive</Link>
          <Link href="/#about">About</Link>
        </nav>

        <div className={styles.contact}>
          <a href="https://mail.google.com/mail/?view=cm&amp;fs=1&amp;to=victoria.mitsu%40gmail.com" target="_blank" rel="noreferrer">Email</a>
          <a href="https://www.linkedin.com/in/victoriamitsu" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://wa.me/6285929819410" target="_blank" rel="noreferrer">WhatsApp</a>
          <a href="https://github.com/victoriamitsu28" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.instagram.com/victoriamitsu" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://www.tiktok.com/@victoriamitsu" target="_blank" rel="noreferrer">TikTok</a>
        </div>

        <span className={styles.copyright}>2026</span>
      </div>
    </footer>
  );
}
