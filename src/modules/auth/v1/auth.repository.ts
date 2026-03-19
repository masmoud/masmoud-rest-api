import { UserModel } from "@/modules/user/v1/user.model";
import { IAuth } from "../auth.types";
import {
  AuthDocument,
  AuthDocumentRepo,
  AuthModel,
  AuthModelType,
} from "./auth.model";

export class AuthRepository {
  constructor(
    private readonly authModel: AuthModelType = AuthModel,
    private readonly userModel = UserModel,
  ) {}

  // register
  async register(
    data: Pick<IAuth, "email" | "password">,
  ): Promise<AuthDocument> {
    const auth = new this.authModel(data);
    return await auth.save();
  }

  // Find user by email
  async findByEmail(email: string): Promise<AuthDocumentRepo> {
    return this.authModel.findOne({ email }).select("+password").exec();
  }

  // Find user by Mongo ID
  async findById(id: string): Promise<AuthDocumentRepo> {
    return this.authModel.findById(id).exec();
  }

  async deleteById(id: string) {
    return this.authModel.findByIdAndDelete(id).exec();
  }

  // Add a hashed refresh token to a user
  async addRefreshToken(userId: string, hashedToken: string): Promise<void> {
    await this.authModel
      .findByIdAndUpdate(userId, {
        $push: { refreshTokens: hashedToken },
      })
      .exec();
  }

  // Find user by a hashed refresh token
  async findByRefreshToken(hashedToken: string): Promise<AuthDocumentRepo> {
    return this.authModel.findOne({ refreshTokens: hashedToken }).exec();
  }

  // Remove a hashed refresh token
  async removeRefreshToken(userId: string, hashedToken: string): Promise<void> {
    await this.authModel
      .findByIdAndUpdate(userId, {
        $pull: { refreshTokens: hashedToken },
      })
      .exec();
  }

  // Clear all refresh tokens for a user
  async clearRefreshTokens(userId: string): Promise<void> {
    await this.authModel
      .findByIdAndUpdate(userId, {
        $set: { refreshTokens: [] },
      })
      .exec();
  }
}

export const authRepository = new AuthRepository();
