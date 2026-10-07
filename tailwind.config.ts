import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./emails/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--ink-rgb) / <alpha-value>)",
        paper: "rgb(var(--paper-rgb) / <alpha-value>)",
        "paper-deep": "rgb(var(--paper-deep-rgb) / <alpha-value>)",
        "on-dark": "rgb(var(--on-dark-rgb) / <alpha-value>)",
        dusk: "rgb(var(--dusk-rgb) / <alpha-value>)",
        "dusk-deep": "rgb(var(--dusk-deep-rgb) / <alpha-value>)",
        gold: "rgb(var(--gold-rgb) / <alpha-value>)",
        "gold-hi": "rgb(var(--gold-hi-rgb) / <alpha-value>)",
        leaf: "rgb(var(--leaf-rgb) / <alpha-value>)",
        "leaf-deep": "rgb(var(--leaf-deep-rgb) / <alpha-value>)",
      },
      fontFamily: {
        fraunces: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
