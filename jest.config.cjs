module.exports = {
  globals: {
    "globalThis.__DEV__": JSON.stringify(true),
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src/__tests__"],
  testPathIgnorePatterns: [
    "<rootDir>/src/__tests__/mocks",
    "<rootDir>/.storybook",
    "<rootDir>/dist",
  ],
  setupFiles: ["./jest.polyfills.js"],
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  preset: "ts-jest/presets/default-esm",
  // Opt out of the browser export condition for MSW tests
  // for more information, see: https://github.com/mswjs/msw/issues/1786#issuecomment-1782559851
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
  collectCoverageFrom: ["src/**/*.ts", "!src/__tests__/**/*.ts"],
  coverageReporters: ["html", "json-summary", "text", "text-summary"],
  reporters: ["default", ["jest-junit", { outputDirectory: "coverage" }]],
  transform: {
    "\\.(gql|graphql)$": "@graphql-tools/jest-transform",
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        // Note: We shouldn't need to include `isolatedModules` here because
        // it's a deprecated config option in TS 5, but setting it to `true`
        // fixes the `ESM syntax is not allowed in a CommonJS module when
        // 'verbatimModuleSyntax' is enabled` error that we're seeing when
        // running our Jest tests.
        // See https://github.com/kulshekhar/ts-jest/issues/4081
        isolatedModules: true,
        diagnostics: {
          warnOnly: process.env.TEST_ENV !== "ci",
        },
      },
    ],
  },
  resolver: "ts-jest-resolver",
};
