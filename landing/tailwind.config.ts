import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink:        "#16181A",
        "ink-2":    "#1F2225",
        brass:      "#B9893E",
        "brass-hi": "#D4A958",
        parchment:  "#EFE7D8",
        steel:      "#8D9296",
        "ink-text": "#2A2C2E",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        sans:    ["var(--font-jost)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "72rem",
      },
      borderRadius: {
        btn: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
