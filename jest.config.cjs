module.exports = {
  globals: {
    "globalThis.__DEV__": JSON.stringify(true),
  },
  extensionsToTreatAsEsm: [".ts", ".tsx", ".mts"],
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src/__tests__"],
  testPathIgnorePatterns: [
    "<rootDir>/src/__tests__/mocks",
    "<rootDir>/.storybook",
  ],
  setupFiles: ["./jest.polyfills.js"],
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  preset: "ts-jest/presets/default-esm",
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
        useESM: true,
        diagnostics: {
          warnOnly: process.env.TEST_ENV !== "ci",
        },
      },
    ],
  },
  resolver: "ts-jest-resolver",
};
