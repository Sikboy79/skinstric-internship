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

export default {
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        shimmer: "shimmer 1.8s infinite linear",
      },
      backgroundSize: {
        shimmer: "200% 100%",
      },
    },
  },
};