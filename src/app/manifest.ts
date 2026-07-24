import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Victoria Mitsu Portfolio",
    short_name: "Victoria Mitsu",
    description: "Technology builder for apps, web platforms, AI systems, automation workflows, and technical learning programs.",
    start_url: "/",
    display: "standalone",
    background_color: "#060812",
    theme_color: "#060812",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
