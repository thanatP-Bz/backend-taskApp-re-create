import { Document, Types } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IDocument extends IUser, Document {
  _id: Types.ObjectId;
}
