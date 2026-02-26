import { HydratedDocument } from "mongoose";

export enum Role {
  USER = "user",
  ADMIN = "admin",
}
export namespace RoleTypes {
  export type RoleName = "USER" | "ADMIN";

  export interface RoleDB {
    name: RoleName;
    permissions: string[];
  }

  export type RoleDocument = HydratedDocument<RoleDB>;
  export type RoleDocRepo = RoleDocument | null;
}
