import { UserModel, UserPublic, UserRepository } from "../user";
import { AuthRepository } from "./auth.respository";
import { tokenService } from "./auth.utils";
import { Role } from "@/common/types";
import { errors, hashToken, jwtService } from "@/common/utils";
import {
  AccessTokenPayload,
  AuthResponse,
  RefreshTokenPayload,
} from "./auth.types";

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
          jwtService.verify.access(token)
        : jwtService.verify.refresh(token);

      const userId = payload.sub;

      const user = await this.userRepo.findById(userId);
      if (!user) throw errors.Unauthorized("User not found");

      return this.toPublicUser(user);
    } catch (error) {
      throw errors.Unauthorized("Invalid or expired token");
    }
  }

  async register(
    email: string,
    password: string,
    role: Role,
  ): Promise<AuthResponse> {
    const existing = await this.repo.findByEmail(email);
    if (existing) {
      throw errors.BadRequest("Email already in use");
    }

    const user = await this.repo.createUser({ email, password, role });
    const userId = user._id.toString();

    const accessToken = tokenService.sign.access({
      sub: userId,
      role: user.role,
    });

    const { refreshToken, hashedRefreshToken } =
      tokenService.generate.refresh(userId);

    await this.repo.addRefreshToken(userId, hashedRefreshToken);

    return {
      user: this.toPublicUser(user),
      accessToken,
      refreshToken,
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.repo.findByEmail(email);
    if (!user) throw errors.Unauthorized("Invalid credentials");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw errors.Unauthorized("Invalid credentials");

    const userId = user._id.toString();
    const accessToken = tokenService.sign.access({
      sub: userId,
      role: user.role,
    });

    const { refreshToken, hashedRefreshToken } =
      tokenService.generate.refresh(userId);

    await this.repo.addRefreshToken(userId, hashedRefreshToken);

    return {
      user: this.toPublicUser(user),
      accessToken,
      refreshToken,
    };
  }

  async refresh(token: string) {
    const payload = jwtService.verify.refresh(token);

    const user = await this.repo.findById(payload.sub);
    if (!user) throw errors.Unauthorized("User not found");

    const userId = user._id.toString();

    const hashedToken = hashToken(token);

    const tokenExists = user.refreshTokens.includes(hashedToken);

    if (!tokenExists) {
      // Reuse attack detected -> invalidate all sessions
      await this.repo.clearRefreshTokens(userId);
      throw errors.Unauthorized("Refresj token reuse detected");
    }

    // Remove old refresh token
    await this.repo.removeRefreshToken(userId, token);

    // Generate new refresh token pair
    const { refreshToken, hashedRefreshToken } =
      tokenService.generate.refresh(userId);

    // Generate new access token
    const accessToken = tokenService.sign.access({
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
