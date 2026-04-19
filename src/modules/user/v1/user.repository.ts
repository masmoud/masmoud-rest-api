import { errors } from "@/common/utils";
import { IUser } from "../user.types";
import { UserDocument, UserDocumentRepo, UserModelType } from "./user.model";

export interface UserRepository {
  findAll(): Promise<UserDocument[]>;
  findByAuthId(authId: string): Promise<UserDocumentRepo>;
  findById(id: string): Promise<UserDocumentRepo>;
  create(data: Partial<IUser>): Promise<UserDocument>;
  update(id: string, data: Partial<IUser>): Promise<UserDocumentRepo>;
  delete(id: string): Promise<void>;
}

/** Factory function to create a UserRepository instance with a given Mongoose model. */
export const createUserRepository = (model: UserModelType): UserRepository => ({
  async findAll() {
    return model.find();
  },

  async findByAuthId(authId: string) {
    return model.findOne({ authId }).exec();
  },

  async findById(id: string) {
    return model.findById(id).exec();
  },

  async create(data: Partial<IUser>) {
    try {
      const doc = await model.create(data);
      return doc as UserDocument;
    } catch (error) {
      throw errors.handleMongooseError(error);
    }
  },

  async update(id: string, data: Partial<IUser>) {
    return model.findByIdAndUpdate(id, data, { new: true }).exec();
  },

  async delete(id: string) {
    await model.findByIdAndDelete(id).exec();
  },
});
