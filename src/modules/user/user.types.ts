import { HydratedDocument } from "mongoose";

export enum Role {
  USER = "user",
  ADMIN = "admin",
}

export interface UserPublic {
  id: string;
  email: string;
  role: Role;
}

export interface UserDB {
  email: string;
  password: string;
  role: Role;
  refreshTokens: string[];
}

export interface UserMethods {
  comparePassword(password: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<UserDB, UserMethods>;

export type UserDocRepo = UserDocument | null;
