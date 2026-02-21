import asyncHandler from "express-async-handler";
import { type Request, type Response, type NextFunction } from "express";
import { ApiError } from "../utils/error/ApiError.js";
import { User } from "../models/userModel.js";

const verificationEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    throw new ApiError(400, "Invalid verification token");
  }

  //find user with valid token
  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired verification token");
  }

  //update user
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  res
    .status(200)
    .json({ message: "Email verified successfully. You can now log in" });
});

const resendEmail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send("resendEmail");
  },
);

export { verificationEmail, resendEmail };
