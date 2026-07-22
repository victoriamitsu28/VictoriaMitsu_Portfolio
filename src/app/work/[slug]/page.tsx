import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header/Header";
import { ProjectCaseStudy } from "@/components/project/ProjectCaseStudy/ProjectCaseStudy";
import { getNextProject, getProjectBySlug, projects } from "@/data/projects";

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

  const title = project.title.join(" ");

  return {
    title,
    description: project.caseStudy.intro,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title,
      description: project.caseStudy.intro,
      type: "article",
      images: [{ url: project.caseStudy.heroImage, alt: `${title} case study` }],
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

  return (
    <>
      <Header />
      <main id="main-content">
        <ProjectCaseStudy project={project} nextProject={nextProject} />
      </main>
    </>
  );
}
