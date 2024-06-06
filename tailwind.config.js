const { join } = require("node:path");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [join(__dirname, "./.storybook/**/*.{js,ts,jsx,tsx}")],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
