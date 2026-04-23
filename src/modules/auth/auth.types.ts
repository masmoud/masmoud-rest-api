import { RoleType } from "@/common/types/role.types";
import { HydratedDocument, Model } from "mongoose";

export interface IAuth {
  email: string;
  password: string;
  role: RoleType;
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthMethods {
  comparePassword(password: string): Promise<boolean>;
}

export type AuthModelType = Model<IAuth, {}, AuthMethods>;

export type AuthDocument = HydratedDocument<IAuth, AuthMethods>;
export type AuthDocumentRepo = AuthDocument | null;

export interface AuthRepository {
  register(
    data: Pick<IAuth, "email" | "password" | "role">,
  ): Promise<AuthDocument>;
  login(email: string, password: string): Promise<AuthDocumentRepo>;
  findByEmail(email: string): Promise<AuthDocumentRepo>;
  findById(id: string): Promise<AuthDocumentRepo>;
  deleteById(id: string): Promise<void>;
  addRefreshToken(userId: string, hashedToken: string): Promise<void>;
  findByRefreshToken(hashedToken: string): Promise<AuthDocumentRepo>;
  removeRefreshToken(userId: string, hashedToken: string): Promise<void>;
  clearRefreshTokens(userId: string): Promise<void>;
  updateEmail(authId: string, email: string): Promise<void>;
}

export interface AuthPublic {
  id: string;
  email: string;
  role: RoleType;
}

export interface AuthContext {
  id: string;
  email: string;
  role: RoleType;
}

export interface AuthResponse {
  auth: AuthPublic;
  accessToken: string;
  refreshToken: string;
}

export type JwtExpiry =
  | `${number}${"s" | "m" | "h" | "d" | "w" | "y"}`
  | number;

export interface AccessTokenPayload {
  sub: string; // auth id
  role: RoleType;
}

export interface RefreshTokenPayload {
  sub: string; // auth id
}

export interface RegisterWithTokens extends AuthResponse {
  type: "tokens";
}

export interface RegisterWithoutTokens {
  type: "no_tokens";
  auth: AuthContext;
}

export type RegisterResult = RegisterWithTokens | RegisterWithoutTokens;

export interface AuthService {
  register(
    email: string,
    password: string,
    role?: RoleType,
    options?: { issueTokens?: boolean },
  ): Promise<RegisterResult>;
  login(email: string, password: string): Promise<AuthResponse>;
  refresh(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }>;
  logout(authId: string, refreshToken?: string): Promise<void>;
  deleteById(authId: string): Promise<void>;
}
