import { ImageResponse } from "next/og";

export const alt = "Victoria Mitsu - Tech Builder for Apps, Web, AI, Automation, and Teaching";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "54px 64px",
          background: "#060812",
          color: "#fff7ea",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24 }}>
          <span>VICTORIA * MITSU</span>
          <span>TECH BUILDER / 2026</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 108, lineHeight: 0.82, letterSpacing: "-6px", fontWeight: 700 }}>
          <span>APPS. WEB. AI.</span>
          <span style={{ color: "#7cf7d4" }}>AUTOMATION. TEACHING.</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#f5ede7" }}>
          <span>Useful technology, built from idea to working system.</span>
          <span>INDONESIA / WORLDWIDE</span>
        </div>
      </div>
    ),
    size,
  );
}
