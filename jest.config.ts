module.exports = {
  projects: [
    {
      displayName: "unit",
      preset: "ts-jest",
      testEnvironment: "node",
      globals: {
        "ts-jest": { tsconfig: "tsconfig.test.json" },
      },
      testPathIgnorePatterns: ["/node_modules/", "/dist/"],
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
      },
      testMatch: ["**/*.spec.ts"],
      setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
      clearMocks: true,
    },
  ],
};
