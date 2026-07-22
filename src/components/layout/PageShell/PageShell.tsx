import { Loader } from "@/components/experience/Loader/Loader";
import { Header } from "@/components/layout/Header/Header";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Loader />
      <Header />
      <main id="main-content">{children}</main>
    </>
  );
}
