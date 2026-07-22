import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/work"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      changeFrequency: route === "" ? ("monthly" as const) : ("yearly" as const),
      priority: route === "" ? 1 : 0.8,
    })),
    ...projects.map((project) => ({
      url: `${siteUrl}/work/${project.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.9,
    })),
  ];
}
