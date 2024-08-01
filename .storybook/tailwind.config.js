const { join } = require("node:path");
const { colors } = require("@apollo/tailwind-preset");
const defaultConfig = require("tailwindcss/defaultConfig");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [join(__dirname, "./**/*.{js,ts,jsx,tsx}")],
  plugins: [require("@tailwindcss/aspect-ratio")],
  presets: [defaultConfig, colors],
};
