export interface IUser {
  firstName?: string;
  lastName?: string;
  authId: string;
}

export interface UserPublic {
  id: string;
  firstName?: string;
  lastName?: string;
}
