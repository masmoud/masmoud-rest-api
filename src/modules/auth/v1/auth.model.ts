import { Role } from "@/common/types";
import bcrypt from "bcryptjs";
import { Schema, model } from "mongoose";
import { AuthMethods, AuthModelType, IAuth } from "../auth.types";

export const authSchema = new Schema<IAuth, AuthModelType, AuthMethods>(
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
      enum: Object.values(Role),
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

/** Hashes the password before saving if it has been modified. */
authSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

/** Compares a plain-text password against the stored bcrypt hash. */
authSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

export const AuthModel = model<IAuth, AuthModelType>("Auth", authSchema);

export type {
  AuthDocument,
  AuthDocumentRepo,
  AuthModelType,
} from "../auth.types";
