import { errors } from "@/common/utils/errors";
import { AuthRepository } from "@/modules/auth/auth.types";
import { UserRepository } from "@/modules/user/v1/user.repository";

export interface UserManagementService {
  deleteUserWithAuth(userId: string): Promise<void>;
}

/** Creates a UserManagementService that coordinates cross-module user deletion. */
export const createUserManagementService = (
  userRepo: UserRepository,
  authRepo: AuthRepository,
): UserManagementService => ({
  async deleteUserWithAuth(userId: string) {
    const user = await userRepo.findById(userId);
    if (!user) throw errors.NotFound("User not found");

    await userRepo.delete(userId);
    await authRepo.deleteById(user.authId);
  },
});
