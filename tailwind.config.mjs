/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  corePlugins: {
    preFlight: false,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["Cairo", ...defaultTheme.fontFamily.sans],
      },
      textColor: {
        main: "rgb(var(--color-text-main) / <alpha-value>)",
      },
      backgroundColor: {
        main: "rgb(var(--color-bg-main) / <alpha-value>)",
        muted: "rgb(var(--color-bg-muted) / <alpha-value>)",
      },
      borderColor: {
        main: "rgb(var(--color-border-main) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
