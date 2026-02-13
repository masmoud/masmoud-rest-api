import { Role, UserPublic } from "@/modules/user/user.types";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: Role;
      };
    }
    interface Response {
      user?: UserPublic;
    }
  }
}

export {};
