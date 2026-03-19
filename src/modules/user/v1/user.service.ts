import { errors } from "@/common/utils";
import { IUser } from "../user.types";
import { UserRepository, userRepository } from "./user.repository";

export class UserService {
  constructor(private readonly repo: UserRepository = userRepository) {}

  async getProfile(userId: string): Promise<IUser> {
    const user = await this.repo.findById(userId);
    if (!user) throw errors.Unauthorized("User not authenticated");
    return user;
  }

  async listUsers(): Promise<IUser[]> {
    const users = await this.repo.findAll();
    return users.map((user) => user);
  }

  async getUserById(userId: string): Promise<IUser> {
    const user = await this.repo.findById(userId);
    if (!user) throw errors.NotFound("User not found");
    return user;
  }

  async updateUser(userId: string, data: Partial<any>): Promise<IUser> {
    const user = await this.repo.update(userId, data);
    if (!user) throw errors.NotFound("User not found");
    return user;
  }

  async deleteUser(userId: string): Promise<void> {
    await this.repo.delete(userId);
  }
}

export const userService = new UserService();
