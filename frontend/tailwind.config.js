// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        "custom-dark": "#1c1c1c",
        "text-colour":"#ffffff",
      },
      fontFamily: {
        kanit: ["Kanit", "sans-serif"],
      },
    },
  },
  plugins: [],
};
