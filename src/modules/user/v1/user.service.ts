import { errors } from "@/common/utils";
import { IUser } from "../user.types";
import { UserDocument } from "./user.model";
import { UserRepository, userRepository } from "./user.repository";

export class UserService {
  constructor(private readonly repo: UserRepository = userRepository) {}

  async getProfile(userId: string): Promise<UserDocument> {
    const user = await this.repo.findById(userId);
    if (!user) throw errors.Unauthorized("User not authenticated");
    return user;
  }

  async listUsers(): Promise<UserDocument[]> {
    return this.repo.findAll();
  }

  async getUserById(userId: string): Promise<UserDocument> {
    const user = await this.repo.findById(userId);
    if (!user) throw errors.NotFound("User not found");
    return user;
  }

  async updateUser(
    userId: string,
    data: Partial<IUser>,
  ): Promise<UserDocument> {
    const user = await this.repo.update(userId, data);
    if (!user) throw errors.NotFound("User not found");
    return user;
  }

  async deleteUser(userId: string): Promise<void> {
    await this.repo.delete(userId);
  }
}

export const userService = new UserService();
