import { ImageResponse } from "next/og";

export const alt = "Victoria Mitsu - Software Engineer & Product Builder";
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
          background: "#11100e",
          color: "#f4b083",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24 }}>
          <span>VICTORIA * MITSU</span>
          <span>PORTFOLIO / 2026</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 108, lineHeight: 0.82, letterSpacing: "-6px", fontWeight: 700 }}>
          <span>SOFTWARE</span>
          <span>REAL PROJECTS</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#f5ede7" }}>
          <span>Web products, robotics, education, and community work.</span>
          <span>INDONESIA / WORLDWIDE</span>
        </div>
      </div>
    ),
    size,
  );
}
