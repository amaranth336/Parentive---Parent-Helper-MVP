import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Parentive Brand Palette
        moss: {
          DEFAULT: "#30483B",
          deep: "#30483B",
        },
        sage: {
          DEFAULT: "#AEBBA6",
          soft: "#AEBBA6",
        },
        oat: {
          DEFAULT: "#F5F2EA",
        },
        sand: {
          DEFAULT: "#E7DECF",
          warm: "#E7DECF",
        },
        walnut: {
          DEFAULT: "#594B41",
        },
        honey: {
          DEFAULT: "#D5A552",
          muted: "#D5A552",
        },
        // Semantic tokens
        brand: {
          primary: "#30483B",
          secondary: "#AEBBA6",
          accent: "#D5A552",
        },
        surface: {
          default: "#F5F2EA",
          secondary: "#E7DECF",
          emphasis: "#FFFFFF",
        },
        text: {
          primary: "#594B41",
          secondary: "#30483B",
          brand: "#30483B",
          inverse: "#F5F2EA",
          muted: "#8B7F76",
        },
        border: {
          default: "#D4CAC0",
          subtle: "#E7DECF",
        },
        focus: "#D5A552",
        // State colors - derived but harmonious
        success: {
          DEFAULT: "#4A7C59",
          light: "#E8F5E9",
          dark: "#2E5940",
        },
        warning: {
          DEFAULT: "#D5A552",
          light: "#FFF8E1",
          dark: "#B8914A",
        },
        error: {
          DEFAULT: "#C84B31",
          light: "#FFEBEE",
          dark: "#A23D28",
        },
        info: {
          DEFAULT: "#5B8FA3",
          light: "#E1F5FE",
          dark: "#3D5F6F",
        },
        disabled: {
          DEFAULT: "#C4BFBA",
          text: "#9B968F",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Display
        "display-lg": ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-md": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-sm": ["2.5rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        // Headings
        "h1": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "h2": ["1.875rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        "h3": ["1.5rem", { lineHeight: "1.3", letterSpacing: "-0.005em" }],
        "h4": ["1.25rem", { lineHeight: "1.4", letterSpacing: "0" }],
        // Body
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        "body": ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        // Labels & utility
        "label": ["0.875rem", { lineHeight: "1.4", letterSpacing: "0.01em" }],
        "eyebrow": ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.08em", fontWeight: "600" }],
        "utility": ["0.75rem", { lineHeight: "1.4" }],
      },
      spacing: {
        "section-sm": "3rem",
        "section-md": "5rem",
        "section-lg": "8rem",
        "section-xl": "10rem",
      },
      maxWidth: {
        "reading": "65ch",
        "container-sm": "640px",
        "container-md": "768px",
        "container-lg": "1024px",
        "container-xl": "1280px",
      },
      borderRadius: {
        "subtle": "0.375rem",
        "card": "1rem",
        "organic": "2.5rem",
      },
      boxShadow: {
        "subtle": "0 1px 3px rgba(48, 72, 59, 0.08)",
        "card": "0 4px 12px rgba(48, 72, 59, 0.1)",
        "elevated": "0 10px 30px rgba(48, 72, 59, 0.15)",
        "focus": "0 0 0 3px rgba(213, 165, 82, 0.3)",
      },
      transitionDuration: {
        "fast": "150ms",
        "base": "250ms",
        "slow": "350ms",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};

export default config;
