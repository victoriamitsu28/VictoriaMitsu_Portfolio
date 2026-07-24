import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { siteUrl } from "@/lib/site";

const contentLastModified = new Date("2026-07-24T00:00:00+07:00");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/work"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: contentLastModified,
    })),
    ...projects.map((project) => ({
      url: `${siteUrl}/work/${project.slug}`,
      lastModified: contentLastModified,
    })),
  ];
}
