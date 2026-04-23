import { HydratedDocument, Model, Schema, model } from "mongoose";
import { IUser } from "../user.types";

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
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
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
