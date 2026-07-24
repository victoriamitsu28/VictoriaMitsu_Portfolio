import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header/Header";
import { ProjectCaseStudy } from "@/components/project/ProjectCaseStudy/ProjectCaseStudy";
import { getNextProject, getProjectBySlug, projects } from "@/data/projects";
import { siteUrl } from "@/lib/site";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };

  const projectName = project.title.join(" ");
  const title = `${projectName} Website Case Study`;

  return {
    title,
    description: project.caseStudy.intro,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title,
      description: project.caseStudy.intro,
      type: "article",
      url: `/work/${project.slug}`,
      siteName: "Victoria Mitsu Portfolio",
      images: [{ url: project.caseStudy.heroImage, alt: `${projectName} website case study` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.caseStudy.intro,
      images: [project.caseStudy.heroImage],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  const nextProject = getNextProject(slug);
  const projectName = project.title.join(" ");
  const projectUrl = `${siteUrl}/work/${project.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${projectUrl}/#project`,
        url: projectUrl,
        name: `${projectName} Website Case Study`,
        description: project.caseStudy.intro,
        image: `${siteUrl}${project.caseStudy.heroImage}`,
        dateCreated: project.year,
        creator: { "@id": `${siteUrl}/#victoria-mitsu` },
        keywords: [...project.services, ...project.caseStudy.stack].join(", "),
        locationCreated: {
          "@type": "Place",
          name: project.location,
        },
        sameAs: project.caseStudy.website,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${projectUrl}/#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Work",
            item: `${siteUrl}/work`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: projectName,
            item: projectUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <Header />
      <main id="main-content">
        <ProjectCaseStudy project={project} nextProject={nextProject} />
      </main>
    </>
  );
}
