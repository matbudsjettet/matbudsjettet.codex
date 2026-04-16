export const designTokens = {
  shadowValue: "0 8px 20px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04)",
  color: {
    background: "#F7F6F2",
    surface: "#FFFFFF",
    card: "#FFFFFF",
    text: {
      primary: "#171512",
      secondary: "#4E4A43",
      tertiary: "#7A756B"
    },
    border: {
      subtle: "#EEE8DE",
      default: "#E6E0D6",
      strong: "#CFC6B7"
    },
    saving: {
      text: "#44D07B",
      background: "rgba(68,208,123,0.12)",
      border: "rgba(68,208,123,0.28)"
    },
    premium: {
      text: "#8F7DFF",
      background: "#F0EEFF",
      border: "#DAD5FF"
    },
    food: {
      warm: "#FF7043",
      green: "#43A047",
      blue: "#1E88E5",
      amber: "#FFB300",
      tagBackground: "rgba(0,0,0,0.05)"
    },
    danger: {
      text: "#FF6B6B",
      background: "rgba(255,107,107,0.12)",
      border: "rgba(255,107,107,0.28)"
    }
  },
  spacing: {
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    8: "2rem",
    10: "2.5rem",
    12: "3rem",
    16: "4rem"
  },
  radius: {
    xs: "0.75rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.25rem"
  },
  shadow: {
    app: "0 8px 20px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04)"
  },
  button: {
    radius: "1rem",
    padding: "14px 16px",
    fontSize: "1rem",
    fontWeight: 600,
    primary: {
      background: "linear-gradient(135deg, #6C5CE7 0%, #C026D3 100%)",
      color: "#FFFFFF",
      border: "rgba(108,92,231,0.40)"
    },
    secondary: {
      background: "#FFFFFF",
      color: "#171512",
      border: "#E6E0D6"
    }
  },
  typography: {
    display: { fontSize: "2.75rem", lineHeight: "3rem", fontWeight: 900 },
    title: { fontSize: "1.75rem", lineHeight: "2.125rem", fontWeight: 900 },
    headline: { fontSize: "1.25rem", lineHeight: "1.625rem", fontWeight: 850 },
    body: { fontSize: "0.9375rem", lineHeight: "1.5rem", fontWeight: 500 },
    bodySmall: { fontSize: "0.875rem", lineHeight: "1.25rem", fontWeight: 500 },
    caption: { fontSize: "0.75rem", lineHeight: "1rem", fontWeight: 700 }
  }
} as const;

export type DesignTokens = typeof designTokens;
