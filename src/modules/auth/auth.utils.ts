import { AuthPublic } from "./auth.types";
import { AuthDocument } from "./v1/auth.model";
import bcrypt from "bcryptjs";

/** Maps an auth document to a safe public object, stripping sensitive fields like password. */
export const toPublicAuth = (auth: AuthDocument): AuthPublic => {
  return {
    id: auth._id.toString(),
    email: auth.email,
    role: auth.role,
  };
};

export const refreshTokenCrypto = {
  hash: async (token: string) => bcrypt.hash(token, 10),
  compare: async (token: string, hash: string) => bcrypt.compare(token, hash),
};
