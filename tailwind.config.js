/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
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
