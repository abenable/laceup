/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        mono: {
          dark: "#000000",
          "dark-800": "#1a1a1a",
          "dark-600": "#2b2b2b",
          "dark-400": "#404040",
          light: "#ffffff",
          "light-800": "#f5f5f5",
          "light-600": "#e5e5e5",
          "light-400": "#d4d4d4",
        },
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "card-hover":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        button: "0 2px 4px rgba(0, 0, 0, 0.1)",
        "button-hover": "0 4px 6px rgba(0, 0, 0, 0.15)",
        neon: "0 0 10px var(--tw-shadow-color), 0 0 20px var(--tw-shadow-color)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
