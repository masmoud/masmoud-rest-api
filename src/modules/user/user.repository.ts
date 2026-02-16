import { Model } from "mongoose";
import { UserDB, UserDocument } from "./user.types";

export class UserRepository {
  constructor(private readonly userModel: Model<UserDB>) {}

  async findAll(): Promise<UserDocument[]> {
    const users = this.userModel.find();
    return users as unknown as UserDocument[];
  }

  async findById(id: string): Promise<UserDocument | null> {
    const user = this.userModel.findById(id).exec();
    return user as unknown as UserDocument;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    const user = this.userModel.findOne({ email }).exec();
    return user as unknown as UserDocument;
  }

  async create(data: Partial<UserDB>): Promise<UserDocument> {
    const user = this.userModel.create(data);
    return user as unknown as UserDocument;
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
