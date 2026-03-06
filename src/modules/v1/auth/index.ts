import { authController } from "./auth.controller";
import { authRepository } from "./auth.repository";
import authRoutes from "./auth.routes";
import { authService } from "./auth.service";
import { AuthResponse, AuthUser, JwtExpiry, TokenPayload } from "./auth.types";
import { authUtils, TokenServiceType } from "./auth.utils";
import { authSchemas, LoginInput, RegisterInput } from "./auth.validator";

export const AuthV1 = {
  schemas: authSchemas,
  repository: authRepository,
  service: authService,
  controller: authController,
  utils: authUtils,
  routes: authRoutes,
};

type AuthV1Type = typeof AuthV1;

export type {
  AuthResponse,
  AuthUser,
  AuthV1Type,
  JwtExpiry,
  LoginInput,
  RegisterInput,
  TokenPayload,
  TokenServiceType,
};
