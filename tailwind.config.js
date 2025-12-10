/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./views/**/*.js", "./js/**/*.js", "./components/**/*.js", "./src/**/*.js"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#2b6cee",
        "background-light": "#f6f6f8",
        "background-dark": "#101622",
      },
      fontFamily: {
        display: ["Lexend", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries"),
  ],
};
