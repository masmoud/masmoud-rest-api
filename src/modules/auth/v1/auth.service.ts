import { RoleType } from "@/common/types";
import { errors, hashToken } from "@/common/utils";
import { tokenService } from "../auth.token";
import {
  AccessTokenPayload,
  AuthContext,
  AuthResponse,
  RefreshTokenPayload,
} from "../auth.types";
import { toPublicAuth } from "../auth.utils";
import { authRepository } from "./auth.repository";

export class AuthService {
  constructor(private readonly repo = authRepository) {}

  async getAuthFromToken(
    token: string,
    type: "access" | "refresh" = "access",
  ): Promise<AuthContext> {
    let payload: AccessTokenPayload | RefreshTokenPayload;

    try {
      payload =
        type === "access" ?
          tokenService.verify.access(token)
        : tokenService.verify.refresh(token);

      const auth = await this.repo.findById(payload.sub);

      if (!auth)
        throw errors.Unauthorized("Invalid or expired authorization token");

      return {
        id: auth._id.toString(),
        email: auth.email,
        role: auth.role,
      };
    } catch (error) {
      throw errors.Unauthorized("Invalid or expired token");
    }
  }

  async register(
    email: string,
    password: string,
    _role: RoleType,
  ): Promise<AuthResponse> {
    const existing = await this.repo.findByEmail(email);
    if (existing) throw errors.BadRequest("Email already registered");

    const authDoc = await this.repo.register({
      email,
      password,
      role: _role,
    });

    // Issue access and refresh tokens for the new account.
    const accessToken = tokenService.generate.access({
      sub: authDoc._id.toString(),
      role: authDoc.role,
    });
    const { refreshToken, hashedRefreshToken } = tokenService.generate.refresh(
      authDoc._id.toString(),
    );

    await this.repo.addRefreshToken(authDoc._id.toString(), hashedRefreshToken);

    return {
      user: toPublicAuth(authDoc),
      accessToken,
      refreshToken,
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const authDoc = await this.repo.findByEmail(email);
    if (!authDoc) throw errors.Unauthorized("Invalid credentials");

    const isMatch = await authDoc.comparePassword(password);
    if (!isMatch) throw errors.Unauthorized("Invalid credentials");

    const accessToken = tokenService.generate.access({
      sub: authDoc._id.toString(),
      role: authDoc.role,
    });

    const { refreshToken, hashedRefreshToken } = tokenService.generate.refresh(
      authDoc._id.toString(),
    );

    await this.repo.addRefreshToken(authDoc._id.toString(), hashedRefreshToken);

    return {
      user: toPublicAuth(authDoc),
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) throw errors.Unauthorized("No refresh token provided");

    const payload = tokenService.verify.refresh(refreshToken);
    const hashed = hashToken(refreshToken);
    const authDoc = await this.repo.findById(payload.sub);

    if (!authDoc) throw errors.Unauthorized("Invalid or expired refresh token");
    if (!authDoc.refreshTokens.includes(hashed)) {
      throw errors.Unauthorized("Invalid or expired refresh token");
    }

    // Rotate refresh token on each refresh request.
    const { refreshToken: newToken, hashedRefreshToken } =
      tokenService.generate.refresh(authDoc._id.toString());

    await this.repo.removeRefreshToken(authDoc._id.toString(), hashed);
    await this.repo.addRefreshToken(authDoc._id.toString(), hashedRefreshToken);

    const accessToken = tokenService.generate.access({
      sub: authDoc._id.toString(),
      role: authDoc.role,
    });

    return {
      accessToken,
      refreshToken: newToken,
    };
  }

  async logout(authId: string, refreshToken: string): Promise<void> {
    await this.repo.removeRefreshToken(authId, hashToken(refreshToken));
  }
}

export const authService = new AuthService();
