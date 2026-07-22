import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Victoria Mitsu Portfolio",
    short_name: "Victoria Mitsu",
    description: "Software engineer and product builder working across web development, robotics, education, and community projects.",
    start_url: "/",
    display: "standalone",
    background_color: "#060812",
    theme_color: "#060812",
  };
}
