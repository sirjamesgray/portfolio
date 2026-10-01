import { ImageResponse } from "next/og";
import { getWork } from "@/lib/work-catalog";

export const runtime = "edge";
export const alt = "Jamie Gray work";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = getWork(slug);
  const name = work?.name ?? "Work";
  const line = work?.line ?? "";
  const bar = work?.tone === "blue" ? "#70b8ff" : "#3dd68c";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          backgroundColor: "#000000",
          color: "#e6e6e6",
        }}
      >
        <div style={{ width: 10, height: "100%", backgroundColor: bar }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "72px 80px",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", fontSize: 22, letterSpacing: "0.14em", textTransform: "uppercase", color: "#b4b4b4" }}>
            Jamie Gray
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 72, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1 }}>{name}</div>
            <div style={{ marginTop: 24, fontSize: 28, lineHeight: 1.3, maxWidth: 860, color: "#b4b4b4" }}>{line}</div>
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "#b4b4b4" }}>jamiegray.net/work/{slug}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
