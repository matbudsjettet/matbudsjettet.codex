export const designTokens = {
  shadowValue: "0 8px 24px rgba(20,20,18,0.045), 0 2px 6px rgba(20,20,18,0.025)",
  color: {
    background: "#FAFAF8",
    bgElevated: "#F5F5F2",
    surface: "#FFFFFF",
    surfaceSoft: "#F3F4F0",
    text: {
      primary: "#1C1A17",
      secondary: "#55514B",
      tertiary: "#847F77"
    },
    border: {
      subtle: "#ECECE7",
      default: "#E4E5DF",
      strong: "#D6D8D0"
    },
    brand: {
      default: "#2E7D5A",
      light: "#EDF6F0",
      medium: "#4CAF76",
      strong: "#236248"
    },
    saving: {
      text: "#2E7D5A",
      background: "rgba(46,125,90,0.09)",
      border: "rgba(46,125,90,0.16)"
    },
    premium: {
      text: "#65583D",
      background: "#F7F4EC",
      border: "#E7E0CD"
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
    card: "0 8px 24px rgba(20,20,18,0.045), 0 2px 6px rgba(20,20,18,0.025)",
    elevated: "0 16px 40px rgba(20,20,18,0.055), 0 4px 12px rgba(20,20,18,0.03)",
    hero: "0 20px 48px rgba(20,20,18,0.065), 0 6px 18px rgba(20,20,18,0.035)"
  },
  button: {
    radius: "1rem",
    padding: "14px 20px",
    fontSize: "0.9375rem",
    fontWeight: 700,
    primary: { background: "#2E7D5A", color: "#FFFFFF", border: "transparent" },
    secondary: { background: "#FFFFFF", color: "#1C1A17", border: "#E4E5DF" }
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
