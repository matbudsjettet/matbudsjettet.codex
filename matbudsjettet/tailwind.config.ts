import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    boxShadow: {
      none: "none",
      app: "0 2px 12px rgba(28,26,23,0.06), 0 1px 3px rgba(28,26,23,0.04)",
      card: "0 2px 12px rgba(28,26,23,0.06), 0 1px 3px rgba(28,26,23,0.04)",
      elevated: "0 8px 24px rgba(28,26,23,0.09), 0 2px 8px rgba(28,26,23,0.05)",
      hero: "0 12px 32px rgba(28,26,23,0.10), 0 4px 12px rgba(28,26,23,0.06)",
      saving: "0 8px 20px rgba(46,125,90,0.18)",
      premium: "0 8px 20px rgba(138,111,62,0.14)",
      sm: "0 2px 12px rgba(28,26,23,0.06), 0 1px 3px rgba(28,26,23,0.04)",
      md: "0 8px 24px rgba(28,26,23,0.09), 0 2px 8px rgba(28,26,23,0.05)"
    },
    extend: {
      colors: {
        background: "#F5F1EB",
        "bg-elevated": "#FAF8F4",
        surface: "#FFFFFF",
        "surface-soft": "#EDE8E1",
        card: "#FFFFFF",
        "text-primary": "#1C1A17",
        "text-secondary": "#574F47",
        "text-tertiary": "#8C8278",
        "text-muted": "#8C8278",
        "text-inverse": "#FFFFFF",
        brand: {
          DEFAULT: "#2E7D5A",
          soft: "rgba(46,125,90,0.12)",
          light: "#EBF5EF",
          medium: "#4CAF76",
          strong: "#236248"
        },
        border: {
          subtle: "#EDE7DE",
          DEFAULT: "#E2DAD0",
          strong: "#CAC0B4"
        },
        saving: {
          DEFAULT: "#2E7D5A",
          bg: "rgba(46,125,90,0.10)",
          border: "rgba(46,125,90,0.22)",
          dark: "#236248"
        },
        premium: {
          DEFAULT: "#8A6F3E",
          bg: "#FBF5E8",
          border: "#E8D8B4",
          strong: "#6B5530"
        },
        neutral: {
          50: "#FAF8F4",
          100: "#F5F1EB",
          200: "#EDE8E1",
          300: "#E2DAD0",
          400: "#CAC0B4",
          500: "#8C8278",
          700: "#574F47",
          900: "#1C1A17"
        },
        danger: {
          DEFAULT: "#C0392B",
          bg: "rgba(192,57,43,0.09)",
          border: "rgba(192,57,43,0.20)"
        }
      },
      spacing: {
        "app-1": "0.25rem",
        "app-2": "0.5rem",
        "app-3": "0.75rem",
        "app-4": "1rem",
        "app-5": "1.25rem",
        "app-6": "1.5rem",
        "app-8": "2rem",
        "app-10": "2.5rem",
        "app-12": "3rem",
        "app-16": "4rem"
      },
      borderRadius: {
        xs: "0.5rem",
        sm: "0.75rem",
        md: "1rem",
        lg: "1.25rem",
        xl: "1.5rem",
        "2xl": "1.75rem",
        "3xl": "2rem"
      },
      fontSize: {
        display: ["2.5rem", { lineHeight: "2.75rem", fontWeight: "800" }],
        title: ["1.625rem", { lineHeight: "2rem", fontWeight: "800" }],
        headline: ["1.125rem", { lineHeight: "1.5rem", fontWeight: "700" }],
        body: ["0.9375rem", { lineHeight: "1.5rem", fontWeight: "400" }],
        "body-sm": ["0.875rem", { lineHeight: "1.375rem", fontWeight: "400" }],
        caption: ["0.75rem", { lineHeight: "1rem", fontWeight: "600" }]
      },
      fontFamily: {
        sans: [
          "DM Sans",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ]
      }
    }
  },
  plugins: []
};

export default config;
