import { UserModel } from "../user/user.schema";
import { UserDB, UserDocument } from "../user/user.types";

export class AuthRepository {
  async createUser(
    data: Pick<UserDB, "email" | "password">,
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

  async addRefreshToken(userId: string, token: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      $push: { refreshTokens: token },
    });
  }

  async removeRefreshToken(userId: string, token: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { refreshTokens: token },
    });
  }

  async clearRefreshTokens(userId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      $set: { refreshTokens: [] },
    });
  }
}
