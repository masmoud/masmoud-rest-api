import { authController } from "./auth.controller";
import { authRepository } from "./auth.repository";
import { authService } from "./auth.service";
import { AuthResponse, AuthUser, JwtExpiry, TokenPayload } from "./auth.types";
import { authUtils, TokenServiceType } from "./auth.utils";
import { authSchemas, LoginInput, RegisterInput } from "./auth.validator";

export const AuthModule = {
  schemas: authSchemas,
  repository: authRepository,
  service: authService,
  controller: authController,
  utils: authUtils,
};

type AuthModuleType = typeof AuthModule;

export type {
  AuthModuleType,
  AuthResponse,
  AuthUser,
  JwtExpiry,
  LoginInput,
  RegisterInput,
  TokenPayload,
  TokenServiceType,
};
