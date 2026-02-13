import { Role, UserPublic } from "../user/user.types";

export interface AuthUser {
  id: string;
  role: Role;
}

export interface AccessTokenPayload {
  sub: string; // user id
  role: Role;
}

export interface RefreshTokenPayload {
  sub: string; // user id
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
