/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ["Sora", "ui-sans-serif", "system-ui", "sans-serif"],
        // UI default: JetBrains Mono (technical/academic signature look).
        sans: ["'JetBrains Mono'", "ui-monospace", "'SF Mono'", "Menlo", "monospace"],
        // Long-form body text only (articles, bios, about paragraphs).
        body: ["Urbanist", "Arial", "Helvetica", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "'SF Mono'", "Menlo", "monospace"],
      },
      colors: {
        // NIRO Lab - technical academic robotics palette (token names kept,
        // values remapped from the old NSU royal blue):
        //   graphite-petrol darks, robotics teal primary, signal cyan accent,
        //   cool light surfaces, refined amber reserved for awards/honors.
        "nsu-navy": "#10222C",
        "nsu-ink": "#0B141A",
        "nsu-blue": "#0E7C8C",
        "nsu-sky": "#2FB8CE",
        "nsu-skylight": "#8AD8E6",
        "nsu-ice": "#E7F1F4",
        "nsu-mist": "#F4F8F9",
        "nsu-gold": "#E8A33D",
        "nsu-text": "#17303A",
        "nsu-slate": "#4E6570",
        "nsu-line": "#D3E2E8",
        "nsu-line-dark": "#1E3A44",
        "nsu-success": "#2E9E6B",
        "nsu-error": "#D64550",
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
        "nsu-card":
          "0 1px 2px rgba(16,34,44,0.06), 0 8px 24px -8px rgba(16,34,44,0.12)",
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(ellipse 80% 60% at 70% 20%, rgba(47,184,206,0.22), transparent), linear-gradient(#0B141A, #10222C)",
        "card-sheen":
          "linear-gradient(135deg, rgba(255,255,255,0.06), transparent 40%)",
        "gold-flare": "linear-gradient(90deg, #E8A33D, #F2C063)",
        "sky-gradient": "linear-gradient(90deg, #2FB8CE, #8AD8E6)",
      },
      transitionTimingFunction: {
        precision: "cubic-bezier(0.22, 1, 0.36, 1)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
