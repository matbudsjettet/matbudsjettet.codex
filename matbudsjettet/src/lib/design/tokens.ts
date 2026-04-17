export const designTokens = {
  shadowValue: "0 2px 12px rgba(28,26,23,0.06), 0 1px 3px rgba(28,26,23,0.04)",
  color: {
    background: "#F5F1EB",
    bgElevated: "#FAF8F4",
    surface: "#FFFFFF",
    text: {
      primary: "#1C1A17",
      secondary: "#574F47",
      tertiary: "#8C8278"
    },
    border: {
      subtle: "#EDE7DE",
      default: "#E2DAD0",
      strong: "#CAC0B4"
    },
    brand: {
      default: "#2E7D5A",
      light: "#EBF5EF",
      medium: "#4CAF76",
      strong: "#236248"
    },
    saving: {
      text: "#2E7D5A",
      background: "rgba(46,125,90,0.10)",
      border: "rgba(46,125,90,0.22)"
    },
    premium: {
      text: "#8A6F3E",
      background: "#FBF5E8",
      border: "#E8D8B4"
    },
    danger: {
      text: "#C0392B",
      background: "rgba(192,57,43,0.09)",
      border: "rgba(192,57,43,0.20)"
    }
  },
  spacing: {
    1: "0.25rem", 2: "0.5rem", 3: "0.75rem", 4: "1rem",
    5: "1.25rem", 6: "1.5rem", 8: "2rem", 10: "2.5rem", 12: "3rem", 16: "4rem"
  },
  radius: { xs: "0.5rem", sm: "0.75rem", md: "1rem", lg: "1.25rem", xl: "1.5rem", "2xl": "1.75rem" },
  shadow: {
    card: "0 2px 12px rgba(28,26,23,0.06), 0 1px 3px rgba(28,26,23,0.04)",
    elevated: "0 8px 24px rgba(28,26,23,0.09), 0 2px 8px rgba(28,26,23,0.05)",
    hero: "0 12px 32px rgba(28,26,23,0.10), 0 4px 12px rgba(28,26,23,0.06)"
  },
  button: {
    radius: "1rem",
    padding: "14px 20px",
    fontSize: "0.9375rem",
    fontWeight: 700,
    primary: { background: "#2E7D5A", color: "#FFFFFF", border: "transparent" },
    secondary: { background: "#FFFFFF", color: "#1C1A17", border: "#E2DAD0" }
  },
  typography: {
    display: { fontSize: "2.5rem", lineHeight: "2.75rem", fontWeight: 800 },
    title: { fontSize: "1.625rem", lineHeight: "2rem", fontWeight: 800 },
    headline: { fontSize: "1.125rem", lineHeight: "1.5rem", fontWeight: 700 },
    body: { fontSize: "0.9375rem", lineHeight: "1.5rem", fontWeight: 400 },
    bodySmall: { fontSize: "0.875rem", lineHeight: "1.375rem", fontWeight: 400 },
    caption: { fontSize: "0.75rem", lineHeight: "1rem", fontWeight: 600 }
  }
} as const;

export type DesignTokens = typeof designTokens;
