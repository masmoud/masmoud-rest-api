import { Role } from "@/common/types";
import bcrypt from "bcryptjs";
import { Model, Schema, model } from "mongoose";
import { AuthMethods, IAuth } from "../auth.types";

export type AuthModelType = Model<IAuth, {}, AuthMethods>;

const authSchema = new Schema<IAuth, AuthModelType, AuthMethods>(
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

authSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

authSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

export const AuthModel = model<IAuth, AuthModelType>("Auth", authSchema);

export type AuthDocument = ReturnType<(typeof AuthModel)["hydrate"]>;
export type AuthDocumentRepo = AuthDocument | null;
