import { errors } from "@/common/utils";
import { UserRepository, userRepository } from "./user.repository";
import { UserDocument, UserPublic } from "./user.types";

export class UserService {
  constructor(private readonly repo: UserRepository = userRepository) {}

  private toPublicUser(user: UserDocument): UserPublic {
    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };
  }

  async getProfile(userId: string): Promise<UserPublic> {
    const user = await this.repo.findById(userId);
    if (!user) throw errors.Unauthorized("User not authenticated");
    return this.toPublicUser(user);
  }

  async listUsers(): Promise<UserPublic[]> {
    const users = await this.repo.findAll();
    return users.map((u) => this.toPublicUser(u));
  }

  async getUserById(userId: string): Promise<UserPublic> {
    const user = await this.repo.findById(userId);
    if (!user) throw errors.NotFound("User not found");
    return this.toPublicUser(user);
  }

  async updateUser(userId: string, data: Partial<any>): Promise<UserPublic> {
    const user = await this.repo.update(userId, data);
    if (!user) throw errors.NotFound("User not found");
    return this.toPublicUser(user);
  }

  async deleteUser(userId: string): Promise<void> {
    await this.repo.delete(userId);
  }
}

export const userService = new UserService();
