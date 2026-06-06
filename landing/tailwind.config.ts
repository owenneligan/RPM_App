import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0A1628",
          800: "#0F1E38",
          700: "#152847",
        },
        gold: {
          500: "#C4953A",
          400: "#D4A84B",
          300: "#E8C97A",
        },
        cream: "#F0EBE1",
        offwhite: "#F5F0E8",
        muted: "#8B9BAE",
        "navy-text": "#0A1628",
        "cream-muted": "#7A7268",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "72rem",
      },
      fontSize: {
        "display-hero": ["clamp(3rem,6.5vw,5.5rem)", { lineHeight: "1.02", letterSpacing: "-0.025em" }],
        "display-section": ["clamp(1.75rem,3vw,2.5rem)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
      },
    },
  },
  plugins: [],
};

export default config;
