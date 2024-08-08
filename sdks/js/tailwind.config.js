/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  // prefix: "sai-",
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss"), require("autoprefixer")],
  corePlugins: {
    preflight: false,
  },

  // safelist: [
  //   {
  //     pattern: /bg-(red|green|blue|orange)-(100|500|700)/, // You can display all the colors that you need
  //     variants: ["lg", "hover", "focus", "lg:hover"], // Optional
  //   },
  //   {
  //     pattern: /outline-*/,
  //   },
  // ],
};
