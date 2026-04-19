import { UserManagementService } from "@/application/user-management.service";
import { Router } from "express";
import { UserController, createUserController } from "./user.controller";
import { UserRepository } from "./user.repository";
import { createUserRoutes } from "./user.routes";
import { UserService, createUserService } from "./user.service";

export interface UserModuleDeps {
  userRepository: UserRepository;
  userManagementService: UserManagementService;
}

export interface UserModule {
  router: Router;
  service: UserService;
  controller: UserController;
}

/** Wires up the user module layers and returns the configured Express router. */
export const createUserModule = (deps: UserModuleDeps): UserModule => {
  const service = createUserService(deps.userRepository);
  const controller = createUserController(service, deps.userManagementService);
  const router = createUserRoutes(controller);

  return { router, service, controller };
};
