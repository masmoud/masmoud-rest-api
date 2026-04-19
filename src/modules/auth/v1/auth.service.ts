import { Role } from "@/common/types";
import { errors } from "@/common/utils";
import { UserRepository } from "@/modules/user/v1/user.repository";
import { TokenService } from "../auth.token";
import {
  AuthRepository,
  AuthService,
  RefreshTokenPayload,
} from "../auth.types";
import { refreshTokenCrypto, toPublicAuth } from "../auth.utils";

export const createAuthService = (
  repo: AuthRepository,
  userRepo: UserRepository,
  tokenSvc: TokenService,
): AuthService => ({
  async register(
    email,
    password,
    role = Role.USER,
    options = { issueTokens: true },
  ) {
    const existing = await repo.findByEmail(email);
    if (existing) throw errors.BadRequest("Email already registered");

    const authDoc = await repo.register({ email, password, role });

    const user = await userRepo.create({ authId: authDoc._id.toString() });

    if (!user) {
      await repo.deleteById(authDoc._id.toString());
      throw errors.InternalServerError("Failed to create user profile");
    }

    if (options.issueTokens === false) {
      return { type: "no_tokens", auth: toPublicAuth(authDoc) };
    }

    const { accessToken } = tokenSvc.generate.access({
      sub: authDoc._id.toString(),
      role: authDoc.role,
    });

    const { refreshToken } = tokenSvc.generate.refresh({
      sub: authDoc._id.toString(),
    });

    const hashedRefreshToken = await refreshTokenCrypto.hash(refreshToken);
    await repo.addRefreshToken(authDoc._id.toString(), hashedRefreshToken);

    return {
      type: "tokens",
      auth: toPublicAuth(authDoc),
      accessToken,
      refreshToken,
    };
  },

  async login(email, password) {
    const authDoc = await repo.findByEmail(email);
    if (!authDoc) throw errors.Unauthorized("Invalid credentials");

    const isMatch = await authDoc.comparePassword(password);
    if (!isMatch) throw errors.Unauthorized("Invalid credentials");

    const { accessToken } = tokenSvc.generate.access({
      sub: authDoc._id.toString(),
      role: authDoc.role,
    });

    const { refreshToken } = tokenSvc.generate.refresh({
      sub: authDoc._id.toString(),
    });

    const hashedRefreshToken = await refreshTokenCrypto.hash(refreshToken);
    await repo.addRefreshToken(authDoc._id.toString(), hashedRefreshToken);

    return { auth: toPublicAuth(authDoc), accessToken, refreshToken };
  },

  async refresh(refreshToken) {
    if (!refreshToken) throw errors.Unauthorized("No refresh token provided");

    let payload: RefreshTokenPayload;
    try {
      payload = tokenSvc.verify.refresh(refreshToken);
    } catch {
      throw errors.Unauthorized("Invalid or expired refresh token");
    }

    const authDoc = await repo.findById(payload.sub);
    if (!authDoc) throw errors.Unauthorized("Invalid or expired refresh token");

    let matchedHash: string | null = null;
    for (const tokenHash of authDoc.refreshTokens) {
      const isMatch = await refreshTokenCrypto.compare(refreshToken, tokenHash);
      if (isMatch) {
        matchedHash = tokenHash;
        break;
      }
    }

    // If no match, the token may be compromised — clear all sessions.
    if (!matchedHash) {
      await repo.clearRefreshTokens(authDoc._id.toString());
      throw errors.Unauthorized("Session compromised. Please log in again");
    }

    const { refreshToken: newToken } = tokenSvc.generate.refresh({
      sub: authDoc._id.toString(),
    });

    const newHashedToken = await refreshTokenCrypto.hash(newToken);

    // Rotate: atomically swap old hash for new one.
    await repo.removeRefreshToken(authDoc._id.toString(), matchedHash);
    await repo.addRefreshToken(authDoc._id.toString(), newHashedToken);

    const { accessToken } = tokenSvc.generate.access({
      sub: authDoc._id.toString(),
      role: authDoc.role,
    });

    return { accessToken, refreshToken: newToken };
  },

  async logout(authId, refreshToken?) {
    const authDoc = await repo.findById(authId);
    if (!authDoc) throw errors.NotFound("Auth record not found");

    if (refreshToken) {
      const compareResults = await Promise.all(
        authDoc.refreshTokens.map(async (tokenHash) => {
          const isMatch = await refreshTokenCrypto.compare(
            refreshToken,
            tokenHash,
          );
          return isMatch ? tokenHash : null;
        }),
      );

      const matchedHash = compareResults.find((hash) => hash !== null);

      if (!matchedHash) {
        await repo.clearRefreshTokens(authId);
        return;
      }

      await repo.removeRefreshToken(authId, matchedHash);
    } else {
      await repo.clearRefreshTokens(authId);
    }
  },

  async deleteById(authId) {
    const authDoc = await repo.findById(authId);
    if (!authDoc) throw errors.NotFound("Auth record not found");

    await repo.deleteById(authId);
  },
});
