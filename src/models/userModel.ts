import { model, Schema, Model } from "mongoose";
import { type IUserDocument, type IUser } from "../types/user.js";
import bcrypt from "bcrypt";

export interface UserModel extends Model<IUserDocument> {
  findEmail: (password: string) => Promise<IUserDocument>;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },

    isVerified: { type: Boolean, default: false }, //set default to false
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },

    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    refreshToken: { type: String },
    refreshTokenExpires: { type: Date },
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
userSchema.statics.findEmail = async function (email: string) {
  return await this.findOne({ email });
};

export const User = model<IUserDocument, UserModel>("User", userSchema);
