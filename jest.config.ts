module.exports = {
  projects: [
    // =========================
    // UNIT TESTS
    // =========================
    {
      displayName: "unit",
      preset: "ts-jest",
      testEnvironment: "node",
      testPathIgnorePatterns: ["/node_modules/", "/tests/"],
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
      },
      testMatch: ["**/*.spec.ts"],
      setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
      clearMocks: true,
    },

    // =========================
    // INTEGRATION TESTS
    // =========================
    {
      displayName: "integration",
      preset: "ts-jest",
      testEnvironment: "node",
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
      },
      testMatch: ["**/*.integration.spec.ts"],
      setupFilesAfterEnv: ["<rootDir>/tests/setup.integration.ts"],
      clearMocks: true,
    },
  ],
};
