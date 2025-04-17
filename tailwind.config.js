/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: "640px", // Mobile
        md: "768px", // Tablet
        lg: "1024px", // Desktop pequeno
        xl: "1280px", // Desktop médio
        "2xl": "1536px", // Desktop grande
      },
    },
  },
  plugins: [],
};

export default config;
