import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Jamie Gray, Product Engineer and Design Engineer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          backgroundColor: "#0c0c0c",
          color: "#f4f4f5",
        }}
      >
        <div
          style={{
            width: 10,
            height: "100%",
            backgroundColor: "#10b981",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "72px 80px",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#a1a1aa",
            }}
          >
            Product Engineer / Design Engineer
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 84,
                fontWeight: 600,
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}
            >
              Jamie Gray
            </div>
            <div
              style={{
                marginTop: 28,
                fontSize: 36,
                lineHeight: 1.25,
                maxWidth: 860,
                color: "#e4e4e7",
              }}
            >
              I design in code and ship real products with AI agents.
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 22,
              color: "#a1a1aa",
            }}
          >
            <div>Fort Worth · Remote or DFW</div>
            <div>jamiegray.net</div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
