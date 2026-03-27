import { IAuth } from "../auth.types";
import {
  AuthDocument,
  AuthDocumentRepo,
  AuthModel,
  AuthModelType,
} from "./auth.model";

export class AuthRepository {
  constructor(private readonly authModel: AuthModelType = AuthModel) {}

  // Create a new auth record.
  async register(
    data: Pick<IAuth, "email" | "password" | "role">,
  ): Promise<AuthDocument> {
    const auth = new this.authModel(data);
    return await auth.save();
  }

  // Find auth record by email.
  async findByEmail(email: string): Promise<AuthDocumentRepo> {
    return this.authModel.findOne({ email }).select("+password").exec();
  }

  // Find auth record by Mongo id.
  async findById(id: string): Promise<AuthDocumentRepo> {
    return this.authModel.findById(id).exec();
  }

  async deleteById(id: string) {
    return this.authModel.findByIdAndDelete(id).exec();
  }

  // Store a hashed refresh token.
  async addRefreshToken(userId: string, hashedToken: string): Promise<void> {
    await this.authModel
      .findByIdAndUpdate(userId, {
        $push: { refreshTokens: hashedToken },
      })
      .exec();
  }

  // Find auth record by hashed refresh token.
  async findByRefreshToken(hashedToken: string): Promise<AuthDocumentRepo> {
    return this.authModel.findOne({ refreshTokens: hashedToken }).exec();
  }

  // Remove a hashed refresh token.
  async removeRefreshToken(userId: string, hashedToken: string): Promise<void> {
    await this.authModel
      .findByIdAndUpdate(userId, {
        $pull: { refreshTokens: hashedToken },
      })
      .exec();
  }

  // Clear all refresh tokens for an auth record.
  async clearRefreshTokens(userId: string): Promise<void> {
    await this.authModel
      .findByIdAndUpdate(userId, {
        $set: { refreshTokens: [] },
      })
      .exec();
  }
}

export const authRepository = new AuthRepository();
