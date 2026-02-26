import { UserPublic } from "@/modules/user";

declare global {
  namespace Express {
    interface Request {
      user?: UserPublic;
    }
  }
}

export {};
