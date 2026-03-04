import { Document, Types } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;

  //verify email
  isVerified: boolean;
  verificationToken: string | null;
  verificationTokenExpires: Date | null;

  //reset password
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;

  //refreshToken
  refreshToken: string | null;
  refreshTokenExpires: Date | null;

  //google oauth
  googleId?: string;
  authProvider: "local" | "google";

  //2FA
  twoFactorSecret?: string | undefined;
  twoFactorEnabled: boolean;
  backupCodes?: [] | undefined;

  //time stamp
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
  comparePassword(password: string): Promise<boolean>;
}
