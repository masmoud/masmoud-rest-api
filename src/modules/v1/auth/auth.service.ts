import { Role } from "@/common/types";
import { errors, hashToken, jwtService } from "@/common/utils";
import { UserDocument, UserPublic } from "../user";
import { userRepository } from "../user/user.repository";
import { authRepository } from "./auth.repository";
import { AuthResponse, TokenPayload } from "./auth.types";
import { tokenService } from "./auth.utils";

export class AuthService {
  constructor(
    private readonly repo = authRepository,
    private readonly userRepo = userRepository,
  ) {}

  private toPublicUser(user: UserDocument): UserPublic {
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
    let payload: TokenPayload | TokenPayload;

    try {
      payload =
        type === "access" ?
          jwtService.verify.access(token)
        : jwtService.verify.refresh(token);

      const user = await this.userRepo.findById(payload.sub);
      if (!user) throw errors.Unauthorized("User not found");

      return this.toPublicUser(user);
    } catch (error) {
      throw errors.Unauthorized("Invalid or expired token");
    }
  }

  async register(
    email: string,
    password: string,
    _role: Role,
  ): Promise<AuthResponse> {
    const existing = await this.repo.findByEmail(email);
    if (existing) throw errors.BadRequest("Email already registered");

    const user = await this.repo.createUser({ email, password });
    const userId = user._id.toString();

    const accessToken = tokenService.sign.access({
      sub: userId,
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

  async refresh(refreshToken: string) {
    if (!refreshToken) throw errors.Unauthorized("No refresh token provided");

    const hashed = hashToken(refreshToken);
    const userDoc = await this.repo.findByRefreshToken(hashed);

    if (!userDoc) throw errors.Unauthorized("Invalid or expired refresh token");

    const userId = userDoc._id.toString();
    // Rotate tokens
    const { refreshToken: newToken, hashedRefreshToken } =
      tokenService.generate.refresh(userId);

    await this.repo.removeRefreshToken(userId, hashed);
    await this.repo.addRefreshToken(userId, hashedRefreshToken);

    const accessToken = tokenService.sign.access({ sub: userId });

    return {
      accessToken,
      refreshToken: newToken,
    };
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    await this.repo.removeRefreshToken(userId, refreshToken);
  }
}

export const authService = new AuthService();
