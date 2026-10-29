import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#fbfbfa",
        ink: "#09090b",
        inkMuted: "#71717a",
        subtle: "#f4f4f5",
        surface: "#ffffff",
        terracotta: "#ea580c",
        brandIndigo: "#4338ca",
        gold: "#d97706",
        emerald: "#059669",
        cyan: "#0284c7",
        hairline: "#e4e4e7",
        darkBg: "#09090b",
        darkSurface: "#18181b",
        darkSubtle: "#27272a",
        darkInk: "#fafafa",
        darkMuted: "#a1a1aa",
        darkHairline: "#27272a",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
