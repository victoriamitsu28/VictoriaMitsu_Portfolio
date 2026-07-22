import type { Metadata } from "next";
import { Header } from "@/components/layout/Header/Header";
import { WorkIndex } from "@/components/work/WorkIndex/WorkIndex";
import { ContactFooter } from "@/components/layout/ContactFooter/ContactFooter";

export const metadata: Metadata = {
  title: "Selected Work",
  description: "Selected software, web engineering, and STEM platform work by Victoria Mitsu.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <WorkIndex />
        <ContactFooter />
      </main>
    </>
  );
}
