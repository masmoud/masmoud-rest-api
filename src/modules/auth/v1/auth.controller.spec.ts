import { authCookies } from "@/common/utils";
import { AppError } from "@/common/utils/errors";
import { AuthService, RegisterResult } from "../auth.types";
import { createAuthController } from "./auth.controller";

// ─── Module mocks ────────────────────────────────────────────────────────────

// authCookies is Object.freeze'd — mock the whole module to replace it.
jest.mock("@/common/utils", () => ({
  ...jest.requireActual("@/common/utils"),
  authCookies: { set: jest.fn(), clear: jest.fn() },
}));

// Mock config so individual tests can control the admin-users list.
jest.mock("@/config", () => ({
  config: {
    auth: { adminUsers: [] as Array<{ email: string; password: string }> },
    server: { nodeEnv: "test" },
  },
}));

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Returns the mocked config so individual tests can override adminUsers. */
const getMockedConfig = () =>
  jest.requireMock("@/config").config as {
    auth: { adminUsers: Array<{ email: string; password: string }> };
  };

/** Builds a minimal mock AuthService with all methods as no-ops by default. */
const makeService = (overrides: Partial<AuthService> = {}): AuthService => ({
  register: jest.fn(),
  login: jest.fn(),
  refresh: jest.fn(),
  logout: jest.fn(),
  deleteById: jest.fn(),
  ...overrides,
});

/** Builds a mock Express Request with sensible defaults. */
const makeReq = (overrides: object = {}): any => ({
  body: {},
  auth: null,
  requestId: "test-req-id",
  cookies: {},
  ...overrides,
});

/** Builds a spy-equipped mock Express Response. */
const makeRes = (): any => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

/** A valid RegisterResult with tokens. */
const makeTokenResult = () =>
  ({
    type: "tokens" as const,
    auth: { id: "auth-1", email: "user@test.com", role: "user" as const },
    accessToken: "access-token",
    refreshToken: "refresh-token",
  }) satisfies RegisterResult;

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("AuthController.register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getMockedConfig().auth.adminUsers = [];
  });

  describe("success path", () => {
    it("calls service.register with email and password", async () => {
      const service = makeService({
        register: jest.fn().mockResolvedValue(makeTokenResult()),
      });
      const controller = createAuthController(service);
      const req = makeReq({
        body: { email: "user@test.com", password: "Pass1234" },
      });
      const res = makeRes();

      await controller.register(req, res);

      expect(service.register).toHaveBeenCalledTimes(1);
      expect(service.register).toHaveBeenCalledWith("user@test.com", "Pass1234");
    });

    it("responds 201 with auth and accessToken", async () => {
      const result = makeTokenResult();
      const service = makeService({ register: jest.fn().mockResolvedValue(result) });
      const controller = createAuthController(service);
      const req = makeReq({ body: { email: "user@test.com", password: "Pass1234" } });
      const res = makeRes();

      await controller.register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            user: result.auth,
            accessToken: result.accessToken,
          }),
        }),
      );
    });

    it("sets auth cookies with the issued tokens", async () => {
      const result = makeTokenResult();
      const service = makeService({ register: jest.fn().mockResolvedValue(result) });
      const controller = createAuthController(service);
      const req = makeReq({ body: { email: "user@test.com", password: "Pass1234" } });
      const res = makeRes();

      await controller.register(req, res);

      expect(authCookies.set).toHaveBeenCalledWith(
        res,
        result.accessToken,
        result.refreshToken,
      );
    });
  });

  describe("admin email guard", () => {
    it("throws Forbidden when the email matches a configured admin", async () => {
      getMockedConfig().auth.adminUsers = [
        { email: "admin@test.com", password: "Admin123!" },
      ];

      const service = makeService();
      const controller = createAuthController(service);
      const req = makeReq({ body: { email: "admin@test.com", password: "Pass1234" } });
      const res = makeRes();

      await expect(controller.register(req, res)).rejects.toThrow(AppError);
      await expect(controller.register(req, res)).rejects.toMatchObject({
        statusCode: 403,
        message: expect.stringContaining("Admin accounts cannot register"),
      });
      expect(service.register).not.toHaveBeenCalled();
    });

    it("does not block a non-admin email", async () => {
      getMockedConfig().auth.adminUsers = [
        { email: "admin@test.com", password: "Admin123!" },
      ];

      const result = makeTokenResult();
      const service = makeService({ register: jest.fn().mockResolvedValue(result) });
      const controller = createAuthController(service);
      const req = makeReq({ body: { email: "regular@test.com", password: "Pass1234" } });
      const res = makeRes();

      await expect(controller.register(req, res)).resolves.toBeUndefined();
      expect(service.register).toHaveBeenCalledTimes(1);
    });
  });

  describe("service error propagation", () => {
    it("re-throws when service.register rejects", async () => {
      const serviceError = new AppError("Email already registered", 400, "VALIDATION_ERROR");
      const service = makeService({ register: jest.fn().mockRejectedValue(serviceError) });
      const controller = createAuthController(service);
      const req = makeReq({ body: { email: "dup@test.com", password: "Pass1234" } });
      const res = makeRes();

      await expect(controller.register(req, res)).rejects.toThrow("Email already registered");
    });

    it("throws InternalServerError when service returns no_tokens result", async () => {
      const service = makeService({
        register: jest.fn().mockResolvedValue({ type: "no_tokens", auth: {} }),
      });
      const controller = createAuthController(service);
      const req = makeReq({ body: { email: "user@test.com", password: "Pass1234" } });
      const res = makeRes();

      await expect(controller.register(req, res)).rejects.toMatchObject({
        statusCode: 500,
        message: "Token generation failed",
      });
      expect(authCookies.set).not.toHaveBeenCalled();
    });
  });
});
