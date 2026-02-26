import { Role } from "@/common/types/role.types";
import { HydratedDocument, Model } from "mongoose";
import { UserModel } from "./user.model";

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

export type UserDocument = ReturnType<(typeof UserModel)["hydrate"]>;
export type UserModelType = Model<UserDB, {}, UserMethods>;
export type UserDocRepo = UserDocument | null;
