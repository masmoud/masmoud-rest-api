import { UserDB, UserDocument, UserModelType, UserModule } from "../user";

export class AuthRepository {
  constructor(private readonly userModel: UserModelType = UserModule.model) {}

  // Create a new user
  async createUser(
    data: Pick<UserDB, "email" | "password">,
  ): Promise<UserDocument> {
    const user = new this.userModel(data);
    return await user.save();
  }

  // Find user by email
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select("+password").exec();
  }

  // Find user by Mongo ID
  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  // Add a hashed refresh token to a user
  async addRefreshToken(userId: string, hashedToken: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, {
        $push: { refreshTokens: hashedToken },
      })
      .exec();
  }

  // Find user by a hashed refresh token
  async findByRefreshToken(hashedToken: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ refreshTokens: hashedToken }).exec();
  }

  // Remove a hashed refresh token
  async removeRefreshToken(userId: string, hashedToken: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, {
        $pull: { refreshTokens: hashedToken },
      })
      .exec();
  }

  // Clear all refresh tokens for a user
  async clearRefreshTokens(userId: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, {
        $set: { refreshTokens: [] },
      })
      .exec();
  }
}

export const authRepository = new AuthRepository();
