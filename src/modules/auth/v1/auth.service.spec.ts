import { Role } from "@/common/types";
import { hashToken } from "@/common/utils";
import { tokenService } from "../auth.token";
import { AuthService } from "./auth.service";

const createAuthDoc = (overrides: Record<string, unknown> = {}) => ({
  _id: {
    toString: () => "auth-1",
  },
  email: "user@test.com",
  role: Role.USER,
  refreshTokens: [] as string[],
  comparePassword: jest.fn(),
  ...overrides,
});

describe("AuthService", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("stores the requested role during registration", async () => {
    const authDoc = createAuthDoc({ role: Role.ADMIN });
    const repo = {
      findByEmail: jest.fn().mockResolvedValue(null),
      register: jest.fn().mockResolvedValue(authDoc),
      addRefreshToken: jest.fn().mockResolvedValue(undefined),
    };

    jest.spyOn(tokenService.generate, "access").mockReturnValue("access-token");
    jest.spyOn(tokenService.generate, "refresh").mockReturnValue({
      refreshToken: "refresh-token",
      hashedRefreshToken: "hashed-refresh-token",
    });

    const service = new AuthService(repo as any);

    const result = await service.register(
      "admin-created@test.com",
      "Password123!",
      Role.ADMIN,
    );

    expect(repo.register).toHaveBeenCalledWith({
      email: "admin-created@test.com",
      password: "Password123!",
      role: Role.ADMIN,
    });
    expect(repo.addRefreshToken).toHaveBeenCalledWith(
      "auth-1",
      "hashed-refresh-token",
    );
    expect(result).toEqual({
      user: {
        id: "auth-1",
        email: "user@test.com",
        role: Role.ADMIN,
      },
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });
  });

  it("rotates a stored refresh token", async () => {
    const refreshToken = "refresh-token";
    const currentHash = hashToken(refreshToken);
    const repo = {
      findById: jest.fn().mockResolvedValue(
        createAuthDoc({
          refreshTokens: [currentHash],
        }),
      ),
      removeRefreshToken: jest.fn().mockResolvedValue(undefined),
      addRefreshToken: jest.fn().mockResolvedValue(undefined),
    };

    jest.spyOn(tokenService.verify, "refresh").mockReturnValue({
      sub: "auth-1",
    });
    jest.spyOn(tokenService.generate, "refresh").mockReturnValue({
      refreshToken: "rotated-refresh-token",
      hashedRefreshToken: "rotated-refresh-hash",
    });
    jest
      .spyOn(tokenService.generate, "access")
      .mockReturnValue("rotated-access-token");

    const service = new AuthService(repo as any);

    const result = await service.refresh(refreshToken);

    expect(repo.findById).toHaveBeenCalledWith("auth-1");
    expect(repo.removeRefreshToken).toHaveBeenCalledWith("auth-1", currentHash);
    expect(repo.addRefreshToken).toHaveBeenCalledWith(
      "auth-1",
      "rotated-refresh-hash",
    );
    expect(result).toEqual({
      accessToken: "rotated-access-token",
      refreshToken: "rotated-refresh-token",
    });
  });

  it("rejects refresh token reuse when the stored hash is missing", async () => {
    const repo = {
      findById: jest.fn().mockResolvedValue(
        createAuthDoc({
          refreshTokens: [],
        }),
      ),
    };

    jest.spyOn(tokenService.verify, "refresh").mockReturnValue({
      sub: "auth-1",
    });

    const service = new AuthService(repo as any);

    await expect(service.refresh("stale-refresh-token")).rejects.toMatchObject({
      statusCode: 401,
      message: "Invalid or expired refresh token",
    });
  });

  it("hashes the refresh token before removing it on logout", async () => {
    const repo = {
      removeRefreshToken: jest.fn().mockResolvedValue(undefined),
    };

    const service = new AuthService(repo as any);

    await service.logout("auth-1", "plain-refresh-token");

    expect(repo.removeRefreshToken).toHaveBeenCalledWith(
      "auth-1",
      hashToken("plain-refresh-token"),
    );
  });
});
