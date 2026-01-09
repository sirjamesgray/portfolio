import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Jamie Gray | Product Engineer";
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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, #065f46 0%, transparent 50%), radial-gradient(circle at 75% 75%, #064e3b 0%, transparent 50%)",
        }}
      >
        {/* Grid pattern overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Logo - Square black bg with green JG (matching favicon) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            backgroundColor: "#000",
            border: "2px solid rgba(255,255,255,0.1)",
            marginBottom: 40,
          }}
        >
          <svg
            width="100"
            height="100"
            viewBox="0 0 174 174"
            fill="none"
          >
            <path
              d="M13.501 132.5V95.2568H21.501V132.5C21.501 146.031 32.47 157 46.001 157C59.5317 157 70.501 146.031 70.501 132.5V64.4727C70.5008 37.3964 45.5465 17 13.499 17V9H78.501V132.5C78.501 150.449 63.95 165 46.001 165C28.0517 165 13.501 150.449 13.501 132.5Z"
              fill="#34d399"
            />
            <path
              d="M107.501 132.5V41.5C107.501 27.969 118.47 17 132.001 17C145.532 17 156.501 27.969 156.501 41.5V59.4727H164.501V41.5C164.501 23.5507 149.95 9 132.001 9C114.052 9 99.501 23.5507 99.501 41.5V132.5C99.501 150.481 114.26 165 132.177 165C149.624 165 164.044 151.083 164.49 133.681L164.501 132.85V95.2568H118.791V103.257C130.272 103.257 139.759 106.164 146.276 111.21C152.684 116.17 156.501 123.393 156.501 132.85L156.493 133.472C156.158 146.492 145.338 157 132.177 157C118.614 157 107.501 145.999 107.501 132.5Z"
              fill="#34d399"
            />
          </svg>
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#fff",
            marginBottom: 16,
            letterSpacing: "-0.02em",
          }}
        >
          Jamie Gray
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 36,
            color: "#34d399",
            marginBottom: 32,
            fontWeight: 500,
          }}
        >
          Product Engineer
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.6)",
            maxWidth: 800,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          Software solutions with 8 years of UX design experience
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
