import { Hero } from "@/components/hero/Hero/Hero";
import { PageShell } from "@/components/layout/PageShell/PageShell";
import { ArtDirectionRail } from "@/components/experience/ArtDirectionRail/ArtDirectionRail";
import { ContactFooter } from "@/components/layout/ContactFooter/ContactFooter";
import { ProofStack } from "@/components/home/ProofStack/ProofStack";
import { ExperienceField } from "@/components/home/ExperienceField/ExperienceField";
import { AchievementIndex } from "@/components/home/AchievementIndex/AchievementIndex";
import { siteUrl } from "@/lib/site";

export default function HomePage() {
  const personId = `${siteUrl}/#victoria-mitsu`;
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
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}/#profile-page`,
        url: siteUrl,
        name: "Victoria Mitsu - Software Engineer and Product Builder",
        isPartOf: { "@id": `${siteUrl}/#website` },
        mainEntity: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: "Victoria Mitsu",
        givenName: "Victoria",
        familyName: "Mitsu",
        jobTitle: "Software Engineer and Product Builder",
        description:
          "Victoria Mitsu is a software engineer and product builder from Medan, Indonesia, working across web development, robotics, education, and community projects.",
        email: "mailto:victoria.mitsu@gmail.com",
        url: siteUrl,
        image: `${siteUrl}/media/victoria-landing.png`,
        homeLocation: {
          "@type": "Place",
          name: "Medan, Indonesia",
        },
        knowsAbout: [
          "web development",
          "product development",
          "competitive programming",
          "robotics",
          "technical education",
        ],
        sameAs: [
          "https://github.com/victoriamitsu28",
          "https://www.instagram.com/victoriamitsu",
          "https://www.tiktok.com/@victoriamitsu",
          "https://www.linkedin.com/in/victoriamitsu",
        ],
      },
    ],
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Hero />
      <ArtDirectionRail />
      <ProofStack />
      <AchievementIndex />
      <ExperienceField />
      <ContactFooter />
    </PageShell>
  );
}
