import type { Metadata, Viewport } from "next";
import "lenis/dist/lenis.css";
import "@/styles/globals.scss";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { TransitionProvider } from "@/components/transitions/TransitionProvider/TransitionProvider";
import { ExperienceLayer } from "@/components/experience/ExperienceLayer/ExperienceLayer";
import { siteUrl } from "@/lib/site";

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Victoria Mitsu - Software Engineer & Product Builder",
    template: "%s - Victoria Mitsu",
  },
  description:
    "Portfolio of Victoria Mitsu, a software engineer and product builder working across web development, robotics, education, and community projects.",
  applicationName: "Victoria Mitsu Portfolio",
  authors: [{ name: "Victoria Mitsu", url: siteUrl }],
  creator: "Victoria Mitsu",
  publisher: "Victoria Mitsu",
  category: "technology",
  keywords: [
    "software engineer",
    "product development",
    "web development",
    "robotics",
    "competitive programming",
    "Indonesia developer",
    "Medan software developer",
    "Victoria Mitsu",
  ],
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Victoria Mitsu - Software Engineer & Product Builder",
    description:
      "Web products, robotics, competition work, and community projects built with care.",
    siteName: "Victoria Mitsu Portfolio",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Victoria Mitsu, software engineer and product builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Victoria Mitsu - Software Engineer & Product Builder",
    description:
      "Web products, robotics, competition work, and community projects built with care.",
    images: ["/opengraph-image"],
  },
  ...(googleSiteVerification
    ? { verification: { google: googleSiteVerification } }
    : {}),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#060812",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SmoothScrollProvider>
          <TransitionProvider>
            {children}
            <ExperienceLayer />
          </TransitionProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
