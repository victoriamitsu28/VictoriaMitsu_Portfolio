import { Hero } from "@/components/hero/Hero/Hero";
import { PageShell } from "@/components/layout/PageShell/PageShell";
import { ArtDirectionRail } from "@/components/experience/ArtDirectionRail/ArtDirectionRail";
import { ContactFooter } from "@/components/layout/ContactFooter/ContactFooter";
import { ProofStack } from "@/components/home/ProofStack/ProofStack";
import { ExperienceField } from "@/components/home/ExperienceField/ExperienceField";
import { AchievementIndex } from "@/components/home/AchievementIndex/AchievementIndex";
import { ServiceMatrix } from "@/components/home/ServiceMatrix/ServiceMatrix";
import { serviceOfferings } from "@/data/services";
import { siteUrl } from "@/lib/site";

export default function HomePage() {
  const personId = `${siteUrl}/#victoria-mitsu`;
  const serviceNodes = serviceOfferings.map((service) => ({
    "@type": "Service",
    "@id": `${siteUrl}/#service-${service.id}`,
    name: service.title,
    serviceType: service.title,
    description: service.description,
    url: `${siteUrl}/#services`,
    provider: { "@id": personId },
    areaServed: {
      "@type": "Place",
      name: "Worldwide",
    },
  }));
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Victoria Mitsu",
        alternateName: "Victoria Mitsu Portfolio",
        inLanguage: "en",
        publisher: { "@id": personId },
        hasPart: serviceNodes.map((service) => ({ "@id": service["@id"] })),
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}/#profile-page`,
        url: siteUrl,
        name: "Victoria Mitsu - Tech Builder for Apps, Web, AI, and Automation",
        description:
          "Portfolio, services, projects, competition record, and experience of Victoria Mitsu.",
        dateModified: "2026-07-24",
        isPartOf: { "@id": `${siteUrl}/#website` },
        mainEntity: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: "Victoria Mitsu",
        givenName: "Victoria",
        familyName: "Mitsu",
        jobTitle: "Software Engineer and Technology Builder",
        description:
          "Victoria Mitsu is a technology builder from Medan, Indonesia, creating apps, web platforms, AI systems, automation workflows, and technical learning programs.",
        email: "mailto:victoria.mitsu@gmail.com",
        url: siteUrl,
        image: `${siteUrl}/media/victoria-landing.png`,
        homeLocation: {
          "@type": "Place",
          name: "Medan, Indonesia",
        },
        knowsAbout: [
          "application development",
          "web development",
          "product development",
          "artificial intelligence",
          "workflow automation",
          "competitive programming",
          "robotics",
          "technical education",
        ],
        makesOffer: serviceNodes.map((service) => ({
          "@type": "Offer",
          url: `${siteUrl}/#services`,
          itemOffered: { "@id": service["@id"] },
        })),
        sameAs: [
          "https://github.com/victoriamitsu28",
          "https://www.instagram.com/victoriamitsu",
          "https://www.tiktok.com/@victoriamitsu",
          "https://www.linkedin.com/in/victoriamitsu",
        ],
      },
      ...serviceNodes,
    ],
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <Hero />
      <ArtDirectionRail />
      <ServiceMatrix />
      <ProofStack />
      <AchievementIndex />
      <ExperienceField />
      <ContactFooter />
    </PageShell>
  );
}
