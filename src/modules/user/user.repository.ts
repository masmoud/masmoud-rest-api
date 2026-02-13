import { Model } from "mongoose";
import { UserDB, UserDocument } from "./user.types";

export class UserRepository {
  constructor(private readonly userModel: Model<UserDB>) {}

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
}
