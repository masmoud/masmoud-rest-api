export interface IUser {
  firstName?: string;
  lastName?: string;
  email: string;
  authId: string;
}

export interface UserPublic {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
}
