import { UserPublic } from "@/modules/v1/user";

declare global {
  namespace Express {
    interface Request {
      user?: UserPublic;
    }
  }
}

export {};
