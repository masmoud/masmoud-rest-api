/**
 * Composition root — instantiates shared infrastructure once at startup.
 * All application layers that need a repository or service import from here
 * to guarantee a single instance per process.
 */
import { createUserManagementService } from "@/application/user-management.service";
import { tokenService } from "@/modules/auth/auth.token";
import { AuthModel } from "@/modules/auth/v1/auth.model";
import { createAuthRepository } from "@/modules/auth/v1/auth.repository";
import { createAuthService } from "@/modules/auth/v1/auth.service";
import { UserModel } from "@/modules/user/v1/user.model";
import { createUserRepository } from "@/modules/user/v1/user.repository";

export const userRepo = createUserRepository(UserModel);
export const authRepo = createAuthRepository(AuthModel);
export const userManagementSvc = createUserManagementService(
  userRepo,
  authRepo,
);
export const authService = createAuthService(authRepo, userRepo, tokenService);
