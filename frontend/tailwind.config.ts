import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ─── Surface system ───
        "surface": "#fafaf7",
        "surface-bright": "#fafaf7",
        "surface-dim": "#dadad7",
        "surface-variant": "#e2e3e0",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f4f4f1",
        "surface-container": "#eeeeeb",
        "surface-container-high": "#e8e8e5",
        "surface-container-highest": "#e2e3e0",
        // ─── On-surface ───
        "on-surface": "#1a1c1b",
        "on-surface-variant": "#44474f",
        "inverse-surface": "#2f312f",
        "inverse-on-surface": "#f1f1ee",
        // ─── Background ───
        "background": "#fafaf7",
        "on-background": "#1a1c1b",
        // ─── Primary — Judicial Navy ───
        "primary": "#002452",
        "primary-container": "#1b3a6b",
        "primary-fixed": "#d7e2ff",
        "primary-fixed-dim": "#acc7ff",
        "on-primary": "#ffffff",
        "on-primary-container": "#89a5dd",
        "on-primary-fixed": "#001a40",
        "on-primary-fixed-variant": "#294678",
        "inverse-primary": "#acc7ff",
        "surface-tint": "#425e91",
        // ─── Secondary — Justice Gold ───
        "secondary": "#755b00",
        "secondary-container": "#fed255",
        "secondary-fixed": "#ffe08e",
        "secondary-fixed-dim": "#ecc246",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#735a00",
        "on-secondary-fixed": "#241a00",
        "on-secondary-fixed-variant": "#584400",
        // ─── Tertiary — Neutral ───
        "tertiary": "#252525",
        "tertiary-container": "#3a3b3b",
        "tertiary-fixed": "#e4e2e2",
        "tertiary-fixed-dim": "#c7c6c6",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#a6a5a5",
        "on-tertiary-fixed": "#1b1c1c",
        "on-tertiary-fixed-variant": "#464747",
        // ─── Outline ───
        "outline": "#747780",
        "outline-variant": "#c4c6d0",
        // ─── Error ───
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
      },
      borderRadius: {
        DEFAULT: "0.125rem",   // 2px
        lg: "0.25rem",         // 4px
        xl: "0.5rem",          // 8px
        full: "0.75rem",       // 12px
      },
      spacing: {
        "space-xxs": "0.125rem",   // 2px
        "space-xs": "0.25rem",     // 4px
        "space-sm": "0.5rem",      // 8px
        "space-md": "1rem",        // 16px
        "space-lg": "1.5rem",      // 24px
        "space-xl": "2rem",        // 32px
        "space-2xl": "3rem",       // 48px
        "space-3xl": "4rem",       // 64px
        "gutter-mobile": "1rem",   // 16px
        "gutter-desktop": "1.5rem",// 24px
        "max-container": "75rem",  // 1200px
      },
      fontFamily: {
        // Display / Hero
        "display-lg": ["Spectral", "Georgia", "serif"],
        "display-lg-mobile": ["Spectral", "Georgia", "serif"],
        // Headlines
        "headline-lg": ["Spectral", "Georgia", "serif"],
        "headline-lg-mobile": ["Spectral", "Georgia", "serif"],
        "headline-md": ["Spectral", "Georgia", "serif"],
        "headline-sm": ["Spectral", "Georgia", "serif"],
        // Titles
        "title-lg": ["IBM Plex Sans", "system-ui", "sans-serif"],
        "title-md": ["IBM Plex Sans", "system-ui", "sans-serif"],
        // Body
        "body-lg": ["IBM Plex Sans", "system-ui", "sans-serif"],
        "body-md": ["IBM Plex Sans", "system-ui", "sans-serif"],
        "body-sm": ["IBM Plex Sans", "system-ui", "sans-serif"],
        // Labels
        "label-lg": ["IBM Plex Sans", "system-ui", "sans-serif"],
        "label-md": ["IBM Plex Sans", "system-ui", "sans-serif"],
        "label-sm": ["IBM Plex Sans", "system-ui", "sans-serif"],
        // Code / Mono
        "code-md": ["IBM Plex Mono", "Courier New", "monospace"],
      },
      fontSize: {
        "display-lg": ["40px", { lineHeight: "48px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-lg-mobile": ["30px", { lineHeight: "38px", letterSpacing: "-0.015em", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.015em", fontWeight: "700" }],
        "headline-lg-mobile": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-sm": ["20px", { lineHeight: "28px", letterSpacing: "-0.005em", fontWeight: "600" }],
        "title-lg": ["18px", { lineHeight: "24px", letterSpacing: "0em", fontWeight: "600" }],
        "title-md": ["16px", { lineHeight: "22px", letterSpacing: "0em", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "26px", letterSpacing: "0em", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "22px", letterSpacing: "0em", fontWeight: "400" }],
        "body-sm": ["12px", { lineHeight: "18px", letterSpacing: "0.01em", fontWeight: "400" }],
        "label-lg": ["14px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "600" }],
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "600" }],
        "label-sm": ["11px", { lineHeight: "14px", letterSpacing: "0.03em", fontWeight: "500" }],
        "code-md": ["13px", { lineHeight: "20px", letterSpacing: "0.02em", fontWeight: "500" }],
      },
      keyframes: {
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "slide-up": { "0%": { transform: "translateY(8px)", opacity: "0" }, "100%": { transform: "translateY(0)", opacity: "1" } },
        "progress-pulse": { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.6" } },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "slide-up": "slide-up 0.25s ease-out",
        "progress-pulse": "progress-pulse 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
