import Link from "next/link";
import { Header } from "@/components/layout/Header/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="not-found" id="main-content">
        <div>
          <p>404 / Lost in the interface</p>
          <h1>NOT<br />FOUND</h1>
          <Link href="/" data-cursor="link" data-cursor-label="HOME">Back home ↙</Link>
        </div>
      </main>
    </>
  );
}
