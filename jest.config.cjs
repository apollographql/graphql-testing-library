module.exports = {
  globals: {
    "globalThis.__DEV__": JSON.stringify(true),
  },
  testEnvironment: "jsdom",
  setupFiles: ["./jest.polyfills.js"],
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  // Opt out of the browser export condition for MSW tests
  // for more information, see: https://github.com/mswjs/msw/issues/1786#issuecomment-1782559851
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
  transform: {
    "\\.(gql|graphql)$": "@graphql-tools/jest-transform",
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        diagnostics: {
          warnOnly: process.env.TEST_ENV !== "ci",
        },
      },
    ],
  },
  resolver: "ts-jest-resolver",
};
