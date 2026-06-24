/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },

        /* ── Lab Instrument palette — now theme-able via CSS variables ────── */
        // `void` / `void-lifted` / `text-*` are kept as names for backward
        // compatibility but now resolve through the theme variables (light/dark).
        void: "var(--paper)",          // page "paper"
        "void-lifted": "var(--surface)", // raised surface
        paper: "var(--paper)",
        surface: "var(--surface)",
        panel: "var(--panel)",         // inset / muted panel
        ink: {
          DEFAULT: "var(--ink)",       // primary text / strong rules
          muted: "var(--ink-muted)",   // secondary text
          faint: "var(--ink-faint)",   // tertiary / mono labels
        },
        line: {
          DEFAULT: "var(--line)",      // warm hairline
          strong: "var(--line-strong)",// emphatic Swiss rule
          hair: "var(--hairline-strong)", // stronger hairline (inputs / node boxes)
        },
        safety: "var(--safety)",       // brand accent (orange) — used sparingly
        "text-primary": "var(--ink)",
        "text-secondary": "var(--ink-muted)",
      },
      spacing: {
        // fractional steps used by the cinematic refresh (0.25rem cadence)
        "4.5": "1.125rem",
        "5.5": "1.375rem",
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        lab: "0 1px 0 0 rgb(22 25 31 / 0.04), 0 14px 40px -24px rgb(22 25 31 / 0.25)",
        "lab-lg": "0 60px 130px -45px rgb(0 0 0 / 0.85)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "pulse-tick": {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.25" },
        },
        travel: {
          "0%": { left: "0", opacity: "0" },
          "8%": { opacity: "1" },
          "92%": { opacity: "1" },
          "100%": { left: "100%", opacity: "0" },
        },
        slowzoom: { to: { transform: "scale(1)" } },
        cue: {
          "0%,100%": { transform: "scaleY(0.4)", opacity: "0.4" },
          "50%": { transform: "scaleY(1)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "pulse-tick": "pulse-tick 2.4s ease-in-out infinite",
        travel: "travel 3.4s linear infinite",
        slowzoom: "slowzoom 24s ease-out forwards",
        cue: "cue 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
