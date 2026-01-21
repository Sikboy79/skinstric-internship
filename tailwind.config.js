/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roobert: ["var(--font-roobert)"], // variable still used for Tailwind classes
      },
    },
  },
  plugins: [],
};
