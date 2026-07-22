export type Project = {
  id: string;
  slug: string;
  title: [string, string];
  year: string;
  services: string[];
  client: string;
  location: string;
  image: string;
  theme: {
    background: string;
    foreground: string;
    accent: string;
    surface: string;
    muted: string;
    shaderAccent: string;
  };
  caseStudy: {
    eyebrow: string;
    intro: string;
    overview: string;
    challenge: string;
    approach: string;
    result: string;
    website?: string;
    heroImage: string;
    overviewImage: string;
    desktopImage: string;
    detailImages: [string, string];
    mobileImages: [string, string, string];
    stack: string[];
    colors: string[];
    artDirection: string;
    designPrinciples: [string, string, string];
  };
};

export const projects: Project[] = [
  {
    id: "01",
    slug: "chery-medan-amplas",
    title: ["CHERY MEDAN", "AMPLAS"],
    year: "2026",
    services: ["Frontend Engineering", "SEO", "Performance"],
    client: "Chery Automotive",
    location: "Medan, Indonesia",
    image: "/media/work/chery.jpg",
    theme: {
      background: "#0A0A0A",
      foreground: "#F5F1EA",
      accent: "#E31B23",
      surface: "#EAE5DD",
      muted: "#7B7771",
      shaderAccent: "#FF2B31",
    },
    caseStudy: {
      eyebrow: "Automotive Digital Experience",
      intro: "A dealership website shaped for speed, search visibility, mobile usability, and a sharper customer path from browsing to contact.",
      overview: "Victoria contributed website features and frontend components for Chery Medan Amplas, improving responsiveness, page structure, and the experience across desktop and mobile surfaces.",
      challenge: "Automotive websites have to balance high-impact visuals, model information, promotions, analytics, and fast contact paths without becoming slow or difficult to scan.",
      approach: "The build focused on semantic HTML, metadata, sitemap and robots readiness, page-speed optimization, responsive components, and structured paths for Google Ads and analytics tracking.",
      result: "The site became clearer for prospective customers and better prepared for search discovery, campaign traffic, and mobile-first browsing.",
      website: "https://cherymedanamplas.com",
      heroImage: "/media/projects/chery/hero.jpg",
      overviewImage: "/media/projects/chery/overview.jpg",
      desktopImage: "/media/projects/chery/desktop.jpg",
      detailImages: [
        "/media/projects/chery/detail-01.jpg",
        "/media/projects/chery/detail-02.jpg",
      ],
      mobileImages: [
        "/media/projects/chery/mobile-01.jpg",
        "/media/projects/chery/mobile-02.jpg",
        "/media/projects/chery/mobile-03.jpg",
      ],
      stack: ["Next.js", "TypeScript", "SCSS", "SEO", "Analytics"],
      colors: ["#0B0B0B", "#FFFFFF", "#E21E2C", "#707070"],
      artDirection: "High-contrast automotive UI with deep black surfaces, decisive red accents, large vehicle imagery, and practical conversion pathways.",
      designPrinciples: [
        "Vehicle-first hierarchy",
        "Fast path from interest to contact",
        "Performance before ornament",
      ],
    },
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getNextProject(slug: string) {
  const currentIndex = projects.findIndex((project) => project.slug === slug);
  if (currentIndex === -1) return projects[0];
  return projects[(currentIndex + 1) % projects.length];
}
