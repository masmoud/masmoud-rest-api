import { Model, Schema, model } from "mongoose";
import { IUser } from "../user.types";
import { HydratedDocument } from "mongoose";

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      trim: true,
      maxLength: [50, "First name too long"],
    },
    lastName: {
      type: String,
      trim: true,
      maxLength: [50, "Last name too long"],
    },
    authId: {
      type: String,
      ref: "Auth",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export type UserModelType = Model<IUser>;
export const UserModel = model<IUser>("User", userSchema);

export type UserDocument = HydratedDocument<IUser>;
export type UserDocumentRepo = UserDocument | null;
