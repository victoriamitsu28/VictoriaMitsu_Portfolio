"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="error-page" id="main-content">
      <span>Something went wrong</span>
      <h1>THE EXPERIENCE HIT A WALL.</h1>
      <button type="button" onClick={reset}>Try again ↻</button>
    </main>
  );
}
