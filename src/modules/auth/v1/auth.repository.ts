import { errors } from "@/common/utils";
import { AuthRepository, IAuth } from "../auth.types";
import { AuthDocument, AuthModelType } from "./auth.model";

/** Creates an AuthRepository bound to the given Mongoose model. */
export const createAuthRepository = (model: AuthModelType): AuthRepository => ({
  /** Creates a new auth record. Password hashing is handled by the model's pre-save hook. */
  async register(data: Pick<IAuth, "email" | "password" | "role">) {
    const auth = new model(data);
    return (await auth.save()) as AuthDocument;
  },

  /** Validates credentials and returns the auth record, or throws on mismatch. */
  async login(email: string, password: string) {
    const auth = await model.findOne({ email }).select("+password").exec();
    if (!auth) throw errors.Unauthorized("Invalid credentials");

    const isPasswordValid = await auth.comparePassword(password);
    if (!isPasswordValid) throw errors.Unauthorized("Invalid credentials");

    return auth;
  },

  /** Finds by email. Selects the password field for credential verification. */
  async findByEmail(email: string) {
    return model.findOne({ email }).select("+password").exec();
  },

  /** Finds by ID. Used during token validation and middleware authentication. */
  async findById(id: string) {
    return model.findById(id).exec();
  },

  /** Deletes an auth record by ID. */
  async deleteById(id: string) {
    await model.findByIdAndDelete(id).exec();
  },

  /** Appends a hashed refresh token. Only the hash is stored, never the raw token. */
  async addRefreshToken(userId: string, hashedToken: string) {
    await model
      .findByIdAndUpdate(userId, { $push: { refreshTokens: hashedToken } })
      .exec();
  },

  /** Finds an auth record by hashed refresh token. Used during the refresh flow. */
  async findByRefreshToken(hashedToken: string) {
    return model.findOne({ refreshTokens: hashedToken }).exec();
  },

  /** Removes a specific hashed refresh token. Used on logout or token rotation. */
  async removeRefreshToken(userId: string, hashedToken: string) {
    await model
      .findByIdAndUpdate(userId, { $pull: { refreshTokens: hashedToken } })
      .exec();
  },

  /** Clears all refresh tokens. Used for force-logout or on password change. */
  async clearRefreshTokens(userId: string) {
    await model
      .findByIdAndUpdate(userId, { $set: { refreshTokens: [] } })
      .exec();
  },
});
