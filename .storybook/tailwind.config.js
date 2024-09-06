const { join } = require("node:path");
const { createThemes } = require("tw-colors");
const defaultConfig = require("tailwindcss/defaultConfig");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [join(__dirname, "./**/*.{js,ts,jsx,tsx}")],
  presets: [defaultConfig],
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    createThemes({
      liberty: {
        primary: "#86CEBC",
        secondary: "#FFFFFF",
      },
      aces: {
        primary: "#A7A8AA",
        secondary: "#FFFFFF",
      },
      sparks: {
        primary: "#552583",
        secondary: "#FDB927",
      },
      dream: {
        primary: "#E31837",
        secondary: "#FFFFFF",
      },
      sky: {
        primary: "#5091CD",
        secondary: "#FFD520",
      },
      sun: {
        primary: "#0A2240",
        secondary: "#F05023",
      },
      fever: {
        primary: "#E03A3E",
        secondary: "#FFD520",
      },
      mystics: {
        primary: "#002B5C",
        secondary: "#E03A3E",
      },
      wings: {
        primary: "#2456A5",
        secondary: "#C4D600",
      },
      lynx: {
        primary: "#266092",
        secondary: "#79BC43",
      },
      mercury: {
        primary: "#1D1160",
        secondary: "#E56020",
      },
      storm: {
        primary: "#2C5235",
        secondary: "#FEE11A",
      },
      valkyries: {
        primary: "#AC96DB",
        secondary: "#2E2A26",
      },
    }),
  ],
};
