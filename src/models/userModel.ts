import { model, Schema } from "mongoose";
import { type IUser } from "../types/user.js";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

export const User = model<IUser>("User", userSchema);
