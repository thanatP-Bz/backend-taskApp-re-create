import { model, Schema, Model } from "mongoose";
import { type IDocument, type IUser } from "../types/user.js";
import bcrypt from "bcrypt";

export interface UserModel extends Model<IUser> {
  findByEmail: (password: string) => Promise<IDocument>;
}

const userSchema = new Schema<IDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

//hash password
userSchema.pre("save", async function (next) {
  if (!this.password) return next();

  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//compare password
userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

//find by email
userSchema.statics.findByEmail = async function (email: string) {
  return await this.findOne({ email });
};

export const User = model<IDocument, UserModel>("User", userSchema);
