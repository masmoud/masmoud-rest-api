// src/modules/auth/auth.service.ts

import { BadRequestError, UnauthorizedError } from "@/common/utils";
import { UserPublic } from "../user/user.types";
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "./auth.jwt";
import { AuthRepository } from "./auth.respository";
import {
  AccessTokenPayload,
  AuthResponse,
  RefreshTokenPayload,
} from "./auth.types";
import { UserRepository } from "../user/user.repository";
import { UserModel } from "../user/user.schema";

export class AuthService {
  private repo = new AuthRepository();
  private userRepo = new UserRepository(UserModel);

  private toPublicUser(user: any): UserPublic {
    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };
  }

  async getUserFromToken(
    token: string,
    type: "access" | "refresh" = "access",
  ): Promise<UserPublic> {
    let payload: AccessTokenPayload | RefreshTokenPayload;

    try {
      payload =
        type === "access" ?
          verifyAccessToken(token)
        : verifyRefreshToken(token);

      const userId = payload.sub;

      const user = await this.userRepo.findById(userId);
      if (!user) throw UnauthorizedError("User not found");

      return this.toPublicUser(user);
    } catch (error) {
      throw UnauthorizedError("Invalid or expired token");
    }
  }

  async register(email: string, password: string): Promise<AuthResponse> {
    const existing = await this.repo.findByEmail(email);
    if (existing) {
      throw BadRequestError("Email already in use");
    }

    const user = await this.repo.createUser({ email, password });

    const accessToken = signAccessToken({
      sub: user._id.toString(),
      role: user.role,
    });

    const refreshToken = signRefreshToken({
      sub: user._id.toString(),
    });

    await this.repo.addRefreshToken(user._id.toString(), refreshToken);

    return {
      user: this.toPublicUser(user),
      accessToken,
      refreshToken,
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.repo.findByEmail(email);
    if (!user) throw UnauthorizedError("Invalid credentials");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw UnauthorizedError("Invalid credentials");

    const accessToken = signAccessToken({
      sub: user._id.toString(),
      role: user.role,
    });

    const refreshToken = signRefreshToken({
      sub: user._id.toString(),
    });

    await this.repo.addRefreshToken(user._id.toString(), refreshToken);

    return {
      user: this.toPublicUser(user),
      accessToken,
      refreshToken,
    };
  }

  async refresh(token: string) {
    const payload = verifyRefreshToken(token);

    const user = await this.repo.findById(payload.sub);
    if (!user) throw UnauthorizedError("User not found");

    if (!user.refreshTokens.includes(token)) {
      throw UnauthorizedError("Invalid refresh token");
    }

    // Rotate refresh token
    await this.repo.removeRefreshToken(user._id.toString(), token);

    const newRefreshToken = signRefreshToken({ sub: user._id.toString() });

    await this.repo.addRefreshToken(user._id.toString(), newRefreshToken);

    const newAccessToken = signAccessToken({
      sub: user._id.toString(),
      role: user.role,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    await this.repo.removeRefreshToken(userId, refreshToken);
  }
}
