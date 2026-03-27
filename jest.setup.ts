process.env.NODE_ENV = "test";

import dotenv from "dotenv";
dotenv.config({ path: ".env.test", quiet: true });

// Nettoyage automatique des mocks
afterEach(() => {
  jest.clearAllMocks();
});

// Optionnel : supprimer logs pendant tests unitaires
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});
