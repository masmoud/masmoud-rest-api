/**
 * Unit tests for AuthService.register
 *
 * We test the SERVICE layer — not the controller, not the database.
 * All external dependencies are replaced with mocks (fake functions we control).
 */

import { createAuthService } from "./auth.service";

// ─── Mocks ────────────────────────────────────────────────────────────────────

// A fake auth document — what the database would normally return after saving
const fakeAuthDoc = {
  _id: { toString: () => "auth-id-1" },
  email: "user@test.com",
  role: "user" as const,
};

// A fake AuthRepository — replaces real database calls
const makeAuthRepo = (overrides: object = {}): any => ({
  findByEmail: jest.fn().mockResolvedValue(null),     // null = email not taken
  register: jest.fn().mockResolvedValue(fakeAuthDoc), // simulates saving a new auth
  addRefreshToken: jest.fn().mockResolvedValue(undefined),
  deleteById: jest.fn().mockResolvedValue(undefined),
  ...overrides,
});

// A fake UserRepository — replaces the user profile creation
const makeUserRepo = (overrides: object = {}): any => ({
  create: jest.fn().mockResolvedValue({ id: "user-id-1" }), // simulates a created user
  ...overrides,
});

// A fake TokenService — returns hardcoded strings instead of real JWTs
const makeTokenSvc = (): any => ({
  generate: {
    access: jest.fn().mockReturnValue({ accessToken: "fake-access-token" }),
    refresh: jest.fn().mockReturnValue({ refreshToken: "fake-refresh-token" }),
  },
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("AuthService.register", () => {
  it("throws an error when the email is already registered", async () => {
    // findByEmail returns an existing user → email is taken
    const authRepo = makeAuthRepo({
      findByEmail: jest.fn().mockResolvedValue(fakeAuthDoc),
    });

    const service = createAuthService(authRepo, makeUserRepo(), makeTokenSvc());

    await expect(
      service.register("taken@test.com", "Password123!"),
    ).rejects.toMatchObject({ statusCode: 400, message: "Email already registered" });
  });

  it("creates a user profile with the authId and email after saving the auth record", async () => {
    // We spy on userRepo.create to check what arguments it receives
    const userRepo = makeUserRepo();
    const service = createAuthService(makeAuthRepo(), userRepo, makeTokenSvc());

    await service.register("user@test.com", "Password123!");

    // userRepo.create should have been called once with the auth ID (from fakeAuthDoc)
    // and the email — so the user profile is linked to the auth record
    expect(userRepo.create).toHaveBeenCalledWith({
      authId: "auth-id-1",
      email: "user@test.com",
    });
  });

  it("returns the auth data and both tokens on success", async () => {
    const service = createAuthService(makeAuthRepo(), makeUserRepo(), makeTokenSvc());

    const result = await service.register("user@test.com", "Password123!");

    // The result should contain the public auth object and the two tokens
    expect(result).toMatchObject({
      type: "tokens",
      auth: { id: "auth-id-1", email: "user@test.com", role: "user" },
      accessToken: "fake-access-token",
      refreshToken: "fake-refresh-token",
    });
  });

  it("saves a hashed refresh token to the auth record", async () => {
    // The raw token should never be stored — only a hashed version
    const authRepo = makeAuthRepo();
    const service = createAuthService(authRepo, makeUserRepo(), makeTokenSvc());

    await service.register("user@test.com", "Password123!");

    // addRefreshToken must be called with the auth ID and some string (the hash)
    expect(authRepo.addRefreshToken).toHaveBeenCalledWith(
      "auth-id-1",
      expect.any(String),
    );
  });

  it("deletes the auth record and throws a 500 if the user profile could not be created", async () => {
    // userRepo.create returns null → something went wrong on the DB side
    const authRepo = makeAuthRepo();
    const userRepo = makeUserRepo({ create: jest.fn().mockResolvedValue(null) });
    const service = createAuthService(authRepo, userRepo, makeTokenSvc());

    await expect(
      service.register("user@test.com", "Password123!"),
    ).rejects.toMatchObject({ statusCode: 500, message: "Failed to create user profile" });

    // The auth record that was already saved must be rolled back
    expect(authRepo.deleteById).toHaveBeenCalledWith("auth-id-1");
  });

  it("returns no_tokens and skips token generation when issueTokens is false", async () => {
    // This option is used for admin seeding — no tokens should be issued
    const tokenSvc = makeTokenSvc();
    const service = createAuthService(makeAuthRepo(), makeUserRepo(), tokenSvc);

    const result = await service.register("user@test.com", "Password123!", "user", {
      issueTokens: false,
    });

    expect(result.type).toBe("no_tokens");
    expect(tokenSvc.generate.access).not.toHaveBeenCalled();
    expect(tokenSvc.generate.refresh).not.toHaveBeenCalled();
  });
});
