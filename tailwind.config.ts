import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontSize: {
      xs: ["1.125rem", { lineHeight: "1.6rem" }],
      sm: ["1.25rem", { lineHeight: "1.75rem" }],
      base: ["1.375rem", { lineHeight: "1.95rem" }],
      lg: ["1.5rem", { lineHeight: "2rem" }],
      xl: ["1.75rem", { lineHeight: "2.25rem" }],
      "2xl": ["2rem", { lineHeight: "2.5rem" }],
      "3xl": ["2.375rem", { lineHeight: "2.9rem" }],
      "4xl": ["2.875rem", { lineHeight: "3.3rem" }],
      "5xl": ["3.5rem", { lineHeight: "3.95rem" }],
      "6xl": ["4rem", { lineHeight: "4.45rem" }],
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "noir-dark": "#1A1A1A",
        "noir-sepia": "#C8A96E",
        "noir-cream": "#F5F0E8",
        "noir-paper": "#E8DFC8",
        "noir-red": "#8B0000",
      },
      fontFamily: {
        typewriter: ["Special Elite", "serif"],
        ui: ["Inter", "sans-serif"],
        readable: ["Atkinson Hyperlegible", "Segoe UI", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
