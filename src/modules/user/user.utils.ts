import { UserPublic } from "./user.types";
import { UserDocument } from "./v1/user.model";

export function toPublicUser(user: UserDocument): UserPublic {
  return {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
  };
}
