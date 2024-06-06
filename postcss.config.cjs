module.exports = {
  plugins: [
    require("autoprefixer"),
    require("tailwindcss")("./.storybook/tailwind.config.js"),
  ],
};
