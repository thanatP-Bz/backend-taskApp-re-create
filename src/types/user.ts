import { Document, Types } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;

  //verify email
  isVerified: boolean;
  verificationToken: string | undefined;
  verificationTokenExpires: Date | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDocument extends IUser, Document {
  _id: Types.ObjectId;
  comparePassword(password: string): Promise<boolean>;
}
