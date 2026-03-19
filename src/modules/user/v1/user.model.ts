import { Schema, model } from "mongoose";
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

export const UserModel = model<IUser>("User", userSchema);

export type UserDocument = ReturnType<(typeof UserModel)["hydrate"]>;
export type UserDocumentRepo = UserDocument | null;
