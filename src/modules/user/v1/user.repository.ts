import { errors } from "@/common/utils";
import { IUser } from "../user.types";
import { UserDocument, UserDocumentRepo, UserModel } from "./user.model";

export class UserRepository {
  constructor(private readonly userModel = UserModel) {}

  findAll = async (): Promise<UserDocument[]> => {
    return this.userModel.find();
  };

  findByAuthId = async (authId: string): Promise<UserDocumentRepo> => {
    return this.userModel.findOne({ authId }).exec();
  };

  findById = async (id: string): Promise<UserDocumentRepo> => {
    return this.userModel.findById(id).exec();
  };

  findByEmail = async (email: string): Promise<UserDocumentRepo> => {
    return this.userModel.findOne({ email }).exec();
  };

  create = async (data: Partial<IUser>): Promise<UserDocument> => {
    try {
      return this.userModel.create(data);
    } catch (error) {
      throw errors.handleMongooseError(error);
    }
  };

  update = async (
    id: string,
    data: Partial<IUser>,
  ): Promise<UserDocumentRepo> => {
    return this.userModel.findByIdAndUpdate(id, data, { new: true });
  };

  delete = async (id: string): Promise<void> => {
    await this.userModel.findByIdAndDelete(id);
  };
}

export const userRepository = new UserRepository();
