import { UserRepository } from "@/modules/user/v1/user.repository";
import { Router } from "express";
import { tokenService } from "../auth.token";
import { AuthRepository, AuthService } from "../auth.types";
import { AuthController, createAuthController } from "./auth.controller";
import { createAuthRoutes } from "./auth.routes";
import { createAuthService } from "./auth.service";

export interface AuthModuleDeps {
  authRepository: AuthRepository;
  userRepository: UserRepository;
}

export interface AuthModule {
  router: Router;
  service: AuthService;
  controller: AuthController;
}

/** Wires up the auth module layers and returns the configured Express router. */
export const createAuthModule = (deps: AuthModuleDeps): AuthModule => {
  const service = createAuthService(
    deps.authRepository,
    deps.userRepository,
    tokenService,
  );
  const controller = createAuthController(service);
  const router = createAuthRoutes(controller);

  return { router, service, controller };
};
