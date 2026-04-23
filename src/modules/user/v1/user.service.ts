import { errors } from "@/common/utils";
import { IUser } from "../user.types";
import { UserDocument } from "./user.model";
import { UserRepository } from "./user.repository";

export interface PaginatedUsers {
  users: UserDocument[];
  total: number;
}

export interface ListUsersOptions {
  skip: number;
  limit: number;
  filters: Record<string, any>;
}

export interface UserService {
  listUsers(options: ListUsersOptions): Promise<PaginatedUsers>;
  getUserById(userId: string): Promise<UserDocument>;
  updateUser(userId: string, data: Partial<IUser>): Promise<UserDocument>;
  deleteById(userId: string): Promise<void>;
}

/** Creates a UserService bound to the given repository. */
export const createUserService = (repo: UserRepository): UserService => ({
  async listUsers(options) {
    const [users, total] = await Promise.all([
      repo.findAll(options),
      repo.count(options.filters),
    ]);
    return { users, total };
  },

  async getUserById(userId: string) {
    const user = await repo.findById(userId);
    if (!user) throw errors.NotFound("User not found");
    return user;
  },

  async updateUser(userId: string, data: Partial<IUser>) {
    const user = await repo.update(userId, data);
    if (!user) throw errors.NotFound("User not found");
    return user;
  },

  async deleteById(userId: string) {
    const user = await repo.findById(userId);
    if (!user) throw errors.NotFound("User not found");

    await repo.delete(userId);
  },
});
