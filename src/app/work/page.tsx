import type { Metadata } from "next";
import { Header } from "@/components/layout/Header/Header";
import { WorkIndex } from "@/components/work/WorkIndex/WorkIndex";
import { ContactFooter } from "@/components/layout/ContactFooter/ContactFooter";

export const metadata: Metadata = {
  title: "Projects & Case Studies",
  description:
    "Selected technology projects by Victoria Mitsu across web platforms, apps, AI systems, automation, SEO, and technical education.",
  alternates: { canonical: "/work" },
  openGraph: {
    type: "website",
    url: "/work",
    title: "Projects & Case Studies | Victoria Mitsu",
    description:
      "Selected technology projects across web platforms, apps, AI systems, automation, SEO, and technical education.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Victoria Mitsu projects and case studies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects & Case Studies | Victoria Mitsu",
    description:
      "Selected technology projects across web platforms, apps, AI systems, automation, SEO, and technical education.",
    images: ["/opengraph-image"],
  },
};

export default function WorkPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <WorkIndex />
        <ContactFooter />
      </main>
    </>
  );
}
