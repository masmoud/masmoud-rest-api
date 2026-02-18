import bcrypt from "bcryptjs";
import { Schema, model } from "mongoose";
import { UserDB, UserMethods } from "./user.types";
import { Role, RoleArray } from "@/common/types";

const userSchema = new Schema<UserDB, {}, UserMethods>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: RoleArray,
      default: Role.USER,
    },
    refreshTokens: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

export const UserModel = model<UserDB>("User", userSchema);
