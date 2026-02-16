import { UserModel } from "../user/user.model";
import { UserDB, UserDocument } from "../user/user.types";

export class AuthRepository {
  async createUser(
    data: Pick<UserDB, "email" | "password" | "role">,
  ): Promise<UserDocument> {
    const user = new UserModel(data);
    return (await user.save()) as unknown as UserDocument;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email }).select(
      "+password",
    ) as Promise<UserDocument | null>;
  }

  async findById(id: string): Promise<UserDocument | null> {
    return UserModel.findById(id);
  }

  async addRefreshToken(userId: string, hashedToken: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      $push: { refreshTokens: hashedToken },
    });
  }

  async removeRefreshToken(userId: string, hashedToken: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { refreshTokens: hashedToken },
    });
  }

  async clearRefreshTokens(userId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      $set: { refreshTokens: [] },
    });
  }
}

export const authRepo = new AuthRepository();
