import { AuthContext } from "@/modules/auth/auth.types";
import { UserPublic } from "@/modules/user/user.types";

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
      user?: UserPublic;
      requestId?: string;
    }
  }
}

export {};
