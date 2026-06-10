import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#16181A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Simplified coil mark — just the brass circle for 32px readability */}
        <svg viewBox="0 0 32 32" width={28} height={28} fill="none">
          <circle cx="14" cy="14" r="5" stroke="#B9893E" strokeWidth="1.8" fill="none" />
          <circle cx="14" cy="14" r="9" stroke="#B9893E" strokeWidth="1.5" fill="none" opacity="0.6" />
          <line x1="23" y1="14" x2="31" y2="14" stroke="#B9893E" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
