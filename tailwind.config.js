/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        appear: {
          "0%": { opacity: "0", transform: "scale(var(--appear-start, 0.9))" },
          "100%": { opacity: "1", transform: "scale(var(--appear-end, 1))" },
        },
      },
      animation: {
        appear: "appear var(--duration, 1s) var(--delay, 0.1s) backwards",
      },
    },
  },
  plugins: [],
};
