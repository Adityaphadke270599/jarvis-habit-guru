import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "var(--ds-paper)",
          deep: "var(--ds-paper-deep)",
          edge: "var(--ds-paper-edge)",
        },
        ink: {
          DEFAULT: "var(--ds-ink)",
          soft: "var(--ds-ink-soft)",
          faint: "var(--ds-ink-faint)",
        },
        brass: {
          DEFAULT: "var(--ds-brass)",
          deep: "var(--ds-brass-deep)",
          tint: "var(--ds-brass-tint)",
        },
        sage: {
          DEFAULT: "var(--ds-sage)",
          tint: "var(--ds-sage-tint)",
        },
        dust: {
          DEFAULT: "var(--ds-dust)",
          tint: "var(--ds-dust-tint)",
        },
        ring: "var(--ds-ring)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
      },
      fontSize: {
        "display-xl": ["2.5rem", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        "display-lg": ["2rem", { lineHeight: "1.2", letterSpacing: "-0.005em" }],
        "display-md": ["1.5rem", { lineHeight: "1.25" }],
        "body-lg": ["1.0625rem", { lineHeight: "1.5" }],
        "body": ["0.9375rem", { lineHeight: "1.55" }],
        "body-sm": ["0.8125rem", { lineHeight: "1.5" }],
        "caps": ["0.6875rem", { lineHeight: "1.2", letterSpacing: "0.12em" }],
        "caps-lg": ["0.8125rem", { lineHeight: "1.2", letterSpacing: "0.1em" }],
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "20px",
        pill: "999px",
      },
      spacing: {
        "0.5": "2px",
        "1": "4px",
        "1.5": "6px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "7": "28px",
        "8": "32px",
        "10": "40px",
        "12": "48px",
        "14": "56px",
        "16": "64px",
      },
      boxShadow: {
        "card": "0 1px 2px rgba(58, 47, 32, 0.04), 0 4px 12px rgba(58, 47, 32, 0.04)",
        "card-lift": "0 2px 4px rgba(58, 47, 32, 0.06), 0 12px 28px rgba(58, 47, 32, 0.08)",
        "inset-line": "inset 0 -1px 0 var(--ds-paper-edge)",
      },
    },
  },
  plugins: [],
};

export default config;
