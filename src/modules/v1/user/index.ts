import { userController } from "./user.controller";
import { UserModel } from "./user.model";
import { userRepository } from "./user.repository";
import { userService } from "./user.service";
import {
  UserDB,
  UserDocRepo,
  UserDocument,
  UserMethods,
  UserModelType,
  UserPublic,
} from "./user.types";
import { userSchemas } from "./user.validator";
import userRoutes from "./user.routes";

export const UserV1 = {
  schemas: userSchemas,
  model: UserModel,
  service: userService,
  controller: userController,
  repository: userRepository,
  routes: userRoutes,
};

export type {
  UserDB,
  UserDocRepo,
  UserDocument,
  UserMethods,
  UserPublic,
  UserModelType,
};
