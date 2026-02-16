import { NotFoundError, UnauthorizedError } from "@/common/utils";
import { UserModel } from "./user.model";
import { UserRepository } from "./user.repository";
import { UserPublic } from "./user.types";

export class UserService {
  private repo = new UserRepository(UserModel);

  private toPublicUser(user: any): UserPublic {
    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };
  }

  async getProfile(userId: string): Promise<UserPublic> {
    const user = await this.repo.findById(userId);
    if (!user) throw UnauthorizedError("User not authenticated");
    return this.toPublicUser(user);
  }

  async listUsers(): Promise<UserPublic[]> {
    const users = await this.repo.findAll();
    return users.map((u) => this.toPublicUser(u));
  }

  async getUserById(userId: string): Promise<UserPublic> {
    const user = await this.repo.findById(userId);
    if (!user) throw NotFoundError("User not found");
    return this.toPublicUser(user);
  }

  async updateUser(userId: string, data: Partial<any>): Promise<UserPublic> {
    const user = await this.repo.update(userId, data);
    if (!user) throw NotFoundError("User not found");
    return this.toPublicUser(user);
  }

  async deleteUser(userId: string): Promise<void> {
    await this.repo.delete(userId);
  }
}

export const userService = new UserService();
