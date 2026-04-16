import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    boxShadow: {
      none: "none",
      app: "0 8px 20px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04)",
      xs: "0 8px 20px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04)",
      sm: "0 8px 20px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04)",
      md: "0 8px 20px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04)",
      premium: "0 8px 20px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04)",
      hero: "0 8px 20px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04)",
      saving: "0 8px 20px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04)"
    },
    extend: {
      colors: {
        background: "#F7F6F2",
        "bg-elevated": "#FBFAF7",
        surface: "#FFFFFF",
        "surface-soft": "#F0ECE5",
        card: "#FFFFFF",
        "text-primary": "#171512",
        "text-secondary": "#4E4A43",
        "text-tertiary": "#7A756B",
        "text-muted": "#7A756B",
        "text-inverse": "#FFFFFF",
        brand: {
          DEFAULT: "#6C5CE7",
          soft: "rgba(108,92,231,0.18)",
          strong: "#8F7DFF"
        },
        border: {
          subtle: "#EEE8DE",
          DEFAULT: "#E6E0D6",
          strong: "#CFC6B7"
        },
        saving: {
          DEFAULT: "#44D07B",
          bg: "rgba(68,208,123,0.12)",
          border: "rgba(68,208,123,0.28)"
        },
        premium: {
          DEFAULT: "#8F7DFF",
          bg: "#F0EEFF",
          border: "#DAD5FF",
          strong: "#C026D3"
        },
        hero: {
          bg: "#0B1020",
          surface: "rgba(255,255,255,0.06)",
          "surface-2": "rgba(255,255,255,0.12)"
        },
        neutral: {
          50: "#FBFAF7",
          100: "#F7F6F2",
          200: "#F0ECE5",
          300: "#E6E0D6",
          700: "#4E4A43",
          900: "#171512"
        },
        danger: {
          DEFAULT: "#FF6B6B",
          bg: "rgba(255,107,107,0.12)",
          border: "rgba(255,107,107,0.28)"
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
        xs: "0.75rem",
        sm: "0.75rem",
        md: "1rem",
        lg: "1.25rem",
        xl: "1.5rem",
        "2xl": "1.75rem"
      },
      fontSize: {
        display: ["2.75rem", { lineHeight: "3rem", fontWeight: "900" }],
        title: ["1.75rem", { lineHeight: "2.125rem", fontWeight: "900" }],
        headline: ["1.25rem", { lineHeight: "1.625rem", fontWeight: "850" }],
        body: ["0.9375rem", { lineHeight: "1.5rem", fontWeight: "500" }],
        "body-sm": ["0.875rem", { lineHeight: "1.25rem", fontWeight: "500" }],
        caption: ["0.75rem", { lineHeight: "1rem", fontWeight: "700" }]
      },
      fontFamily: {
        sans: [
          "Inter",
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
