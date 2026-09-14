import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e6f7ef",
          100: "#c3edd9",
          200: "#9ce2bf",
          300: "#70d6a3",
          400: "#49cb8b",
          500: "#0b9e53", // Popular Hospital signature green / medical accent
          600: "#098c49",
          700: "#07723b",
          800: "#05592e",
          900: "#033b1e",
          DEFAULT: "#0b9e53",
        },
        navy: {
          800: "#2c353a",
          900: "#1e2428",
          DEFAULT: "#384349", // Popular Hospital header top bar dark slate
        },
        accent: {
          50: "#f0fdfa",
          500: "#0d9488",
          600: "#0f766e",
          DEFAULT: "#0284c7",
        }
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
