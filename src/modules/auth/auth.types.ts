import { Role } from "@/common/types/role.types";
import { UserPublic } from "../user/user.types";

export interface AuthUser {
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

export interface TokenPayload {
  sub: string; // user id
}
