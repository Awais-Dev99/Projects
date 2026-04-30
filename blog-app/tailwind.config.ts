import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",      // Scans the app folder
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",    // Scans pages (if used)
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Scans your components folder
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",       // Scans your utils/lib folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;