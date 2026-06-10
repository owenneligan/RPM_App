import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mainspring Advisory — Commercial Operating Systems for Founder-Led Businesses";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#16181A",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Subtle brass tint centre */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(185,137,62,0.06) 0%, transparent 65%)",
          }}
        />

        {/* Mark SVG — exact brand path */}
        <svg
          viewBox="0 0 56 42"
          fill="none"
          width={160}
          height={100}
          style={{ marginBottom: 32 }}
        >
          <path
            d="M20.61,17.26 L18.95,16.14 L17.56,16.61 L16.75,17.48 L16.25,19.36 L16.82,21.35 L18.11,22.76 L19.83,23.55 L21.62,23.68 L23.47,23.2 L24.96,22.24 L26.03,21.07 L26.8,19.61 L27.27,17.06 L26.95,14.96 L25.85,12.68 L24.52,11.22 L22.5,9.94 L20.12,9.25 L17.56,9.25 L15.02,10.01 L12.71,11.48 L10.85,13.62 L9.5,16.68 L9.17,19.68 L9.86,23.18 L11.39,26.0 L13.71,28.35 L16.67,30.0 L20.06,30.78 L22.6,30.75 L25.63,30.01 L28.45,28.55 L30.88,26.42 L32.77,23.7 L33.98,20.55 L34.41,17.14 L34.01,13.66 L32.47,9.79 L30.3,6.86 L27.44,4.5 L24.03,2.86 L20.27,2.06 L16.37,2.19 L12.54,3.27 L9.03,5.26 L6.04,8.08 L3.78,11.58 L2.26,16.29 L2.0,19.15 L2.48,23.48 L4.0,27.63 L6.5,31.36 L9.86,34.42 L13.92,36.63 L18.46,37.82 L20.82,38.0 L54,38"
            stroke="#B9893E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Wordmark */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <p
            style={{
              fontSize: 64,
              fontWeight: 600,
              color: "#EFE7D8",
              letterSpacing: "0.15em",
              lineHeight: 1,
              margin: 0,
            }}
          >
            MAINSPRING
          </p>
          <p
            style={{
              fontSize: 16,
              fontWeight: 400,
              color: "#B9893E",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            ADVISORY
          </p>
        </div>

        {/* Tagline */}
        <p
          style={{
            marginTop: 48,
            fontSize: 20,
            color: "rgba(141,146,150,0.9)",
            letterSpacing: "0.04em",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.5,
          }}
        >
          Commercial Operating Systems · Founder-Led Businesses · £500K–£5M
        </p>
      </div>
    ),
    { ...size }
  );
}
