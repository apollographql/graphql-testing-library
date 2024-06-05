module.exports = {
  src: "./relay-components",
  schema: "./schema.graphql",
  language: "typescript",
  eagerEsModules: true,
  exclude: ["**/node_modules/**", "**/__mocks__/**", "**/__generated__/**"],
};
