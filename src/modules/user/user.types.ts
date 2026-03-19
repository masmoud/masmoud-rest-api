import { RoleType } from "@/common/types/role.types";

export interface IUser {
  firstName: string;
  lastName: string;
  role: RoleType;
  authId: string;
}

export interface UserPublic {
  id: string;
  firstName: string;
  lastName: string;
  role: RoleType;
}
