import { UserModel } from "./user.model";
import { UserDB, UserDocument, UserModelType } from "./user.types";

export class UserRepository {
  constructor(private readonly userModel: UserModelType = UserModel) {}

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(data: Partial<UserDB>): Promise<UserDocument> {
    return this.userModel.create(data);
  }

  async update(
    id: string,
    data: Partial<UserDB>,
  ): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id);
  }
}

export const userRepository = new UserRepository();
