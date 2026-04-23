import { errors } from "@/common/utils/errors";
import { AuthRepository } from "@/modules/auth/auth.types";
import { IUser } from "@/modules/user/user.types";
import { UserDocument } from "@/modules/user/v1/user.model";
import { UserRepository } from "@/modules/user/v1/user.repository";

export interface UserManagementService {
  updateUser(userId: string, data: Partial<IUser>): Promise<UserDocument>;
  deleteUserWithAuth(userId: string): Promise<void>;
}

/** Creates a UserManagementService that coordinates cross-module user operations. */
export const createUserManagementService = (
  userRepo: UserRepository,
  authRepo: AuthRepository,
): UserManagementService => ({
  async updateUser(userId: string, data: Partial<IUser>) {
    const user = await userRepo.update(userId, data);
    if (!user) throw errors.NotFound("User not found");

    if (data.email) {
      await authRepo.updateEmail(user.authId, data.email);
    }

    return user;
  },

  async deleteUserWithAuth(userId: string) {
    const user = await userRepo.findById(userId);
    if (!user) throw errors.NotFound("User not found");

    await userRepo.delete(userId);
    await authRepo.deleteById(user.authId);
  },
});
