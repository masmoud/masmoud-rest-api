import { UserPublic } from "./user.types";
import { UserDocument } from "./v1/user.model";

/** Maps a user document to a safe public object, exposing only non-sensitive fields. */
export function toPublicUser(user: UserDocument): UserPublic {
  return {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };
}
