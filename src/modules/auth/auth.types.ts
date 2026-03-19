import { RoleType } from "@/common/types/role.types";
import { Model } from "mongoose";

export interface IAuth {
  email: string;
  password: string;
  role: RoleType;
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;
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
  user: AuthPublic;
  accessToken: string;
  refreshToken: string;
}

export interface AuthMethods {
  comparePassword(pssword: string): Promise<boolean>;
}

export type UserModelType = Model<IAuth, {}, AuthMethods>;

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
