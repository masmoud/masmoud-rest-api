import { Role } from "@/common/types/role.types";
import { UserPublic } from "../user";

export interface AuthUser {
  id: string;
  role: Role;
}

export interface RequestUser {
  id: string;
  role: Role;
}

export interface AuthResponse {
  user: UserPublic;
  accessToken: string;
  refreshToken: string;
}

export type JwtExpiry =
  | `${number}${"s" | "m" | "h" | "d" | "w" | "y"}`
  | number;

export interface AccessTokenPayload {
  sub: string; // user id
  role: Role;
}

export interface RefreshTokenPayload {
  sub: string; // user id
}
