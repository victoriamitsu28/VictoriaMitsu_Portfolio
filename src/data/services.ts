export type ServiceOffering = {
  id: string;
  index: string;
  title: string;
  strapline: string;
  description: string;
  capabilities: readonly string[];
};

export const serviceOfferings = [
  {
    id: "apps",
    index: "01",
    title: "Apps & Product Builds",
    strapline: "From rough concept to a product people can use.",
    description:
      "MVPs, mobile and web applications, internal tools, and product interfaces shaped around real users and clear goals.",
    capabilities: [
      "Product scoping",
      "UX & interface",
      "Frontend systems",
      "API integrations",
    ],
  },
  {
    id: "web",
    index: "02",
    title: "Web Platforms",
    strapline: "Fast, responsive, and ready to be discovered.",
    description:
      "Marketing websites, product platforms, dashboards, and digital experiences built with strong structure, performance, SEO, and analytics.",
    capabilities: [
      "Web development",
      "Technical SEO",
      "Performance",
      "Analytics",
    ],
  },
  {
    id: "ai-automation",
    index: "03",
    title: "AI & Automation",
    strapline: "Less repetitive work. Better operational signals.",
    description:
      "Practical assistants and connected workflows for summaries, translation, monitoring, alerts, data movement, and everyday operations.",
    capabilities: [
      "Workflow automation",
      "AI integrations",
      "Operational tools",
      "Connected data",
    ],
  },
  {
    id: "teaching",
    index: "04",
    title: "Teaching & Workshops",
    strapline: "Technical ideas made clear, useful, and hands-on.",
    description:
      "Coding, robotics, AI literacy, product building, and competition mentoring for schools, communities, teams, and young builders.",
    capabilities: [
      "Coding workshops",
      "STEM mentoring",
      "Curriculum design",
      "Competition prep",
    ],
  },
] as const satisfies readonly ServiceOffering[];
