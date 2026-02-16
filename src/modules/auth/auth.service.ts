import { BadRequestError, hashToken, UnauthorizedError } from "@/common/utils";
import { UserModel } from "../user/user.model";
import { UserRepository } from "../user/user.repository";
import { Role, UserPublic } from "../user/user.types";
import * as jwt from "./auth.jwt";
import { AuthRepository } from "./auth.respository";
import * as types from "./auth.types";
import { generateRefreshTokenPair } from "./auth.utils";

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
    let payload: types.AccessTokenPayload | types.RefreshTokenPayload;

    try {
      payload =
        type === "access" ?
          jwt.verifyAccessToken(token)
        : jwt.verifyRefreshToken(token);

      const userId = payload.sub;

      const user = await this.userRepo.findById(userId);
      if (!user) throw UnauthorizedError("User not found");

      return this.toPublicUser(user);
    } catch (error) {
      throw UnauthorizedError("Invalid or expired token");
    }
  }

  async register(
    email: string,
    password: string,
    role: Role,
  ): Promise<types.AuthResponse> {
    const existing = await this.repo.findByEmail(email);
    if (existing) {
      throw BadRequestError("Email already in use");
    }

    const user = await this.repo.createUser({ email, password, role });
    const userId = user._id.toString();

    const accessToken = jwt.signAccessToken({
      sub: userId,
      role: user.role,
    });

    const { refreshToken, hashedRefreshToken } =
      generateRefreshTokenPair(userId);

    await this.repo.addRefreshToken(userId, hashedRefreshToken);

    return {
      user: this.toPublicUser(user),
      accessToken,
      refreshToken,
    };
  }

  async login(email: string, password: string): Promise<types.AuthResponse> {
    const user = await this.repo.findByEmail(email);
    if (!user) throw UnauthorizedError("Invalid credentials");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw UnauthorizedError("Invalid credentials");

    const userId = user._id.toString();
    const accessToken = jwt.signAccessToken({
      sub: userId,
      role: user.role,
    });

    const { refreshToken, hashedRefreshToken } =
      generateRefreshTokenPair(userId);

    await this.repo.addRefreshToken(userId, hashedRefreshToken);

    return {
      user: this.toPublicUser(user),
      accessToken,
      refreshToken,
    };
  }

  async refresh(token: string) {
    const payload = jwt.verifyRefreshToken(token);

    const user = await this.repo.findById(payload.sub);
    if (!user) throw UnauthorizedError("User not found");

    const userId = user._id.toString();

    const hashedToken = hashToken(token);

    const tokenExists = user.refreshTokens.includes(hashedToken);

    if (!tokenExists) {
      // Reuse attack detected -> invalidate all sessions
      await this.repo.clearRefreshTokens(userId);
      throw UnauthorizedError("Refresj token reuse detected");
    }

    // Remove old refresh token
    await this.repo.removeRefreshToken(userId, token);

    // Generate new refresh token pair
    const { refreshToken, hashedRefreshToken } =
      generateRefreshTokenPair(userId);

    // Generate new access token
    const accessToken = jwt.signAccessToken({
      sub: userId,
      role: user.role,
    });

    // Store new hashed refresh token
    await this.repo.addRefreshToken(userId, hashedRefreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    await this.repo.removeRefreshToken(userId, refreshToken);
  }
}

export const authService = new AuthService();
