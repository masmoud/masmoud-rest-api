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

export const UserModule = {
  schemas: userSchemas,
  model: UserModel,
  service: userService,
  controller: userController,
  repository: userRepository,
};

export type {
  UserDB,
  UserDocRepo,
  UserDocument,
  UserMethods,
  UserPublic,
  UserModelType,
};
