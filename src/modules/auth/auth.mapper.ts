import { AuthPublic } from "./auth.types";
import { AuthDocument } from "./v1/auth.model";

export const authMapper = {
  toPublic(auth: AuthDocument): AuthPublic {
    return {
      id: auth._id.toString(),
      email: auth.email,
      role: auth.role,
      userId: auth.userId.toString(),
    };
  },
};
