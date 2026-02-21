import asyncHandler from "express-async-handler";
import { type Request, type Response, type NextFunction } from "express";
import { User } from "../models/userModel.js";
import { ApiError } from "../utils/error/ApiError.js";
import { generateVerificationToken } from "../utils/token/generateVerificationToken.js";
import { verificationEmailTemplate } from "../utils/email/emailTemplate.js";
import { sendEmail } from "../utils/email/sendEmail.js";

const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    //check validation
    if (!name || !email || !password) {
      throw new ApiError(400, "all field are required");
    }

    //check user exist
    const userExist = await User.findEmail(email);

    if (userExist) {
      throw new ApiError(400, "this email has already been in use");
    }

    //generate Token for verification
    const verificationToken = generateVerificationToken();
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await User.create({
      name,
      email,
      password,
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    //send verification email
    const emailTemplates = verificationEmailTemplate(email, verificationToken);
    await sendEmail({
      to: email,
      ...emailTemplates,
    });

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      message:
        "register successfully! Please check your email to verify your account",
    });
  },
);

const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "all filed are required");
    }

    //check user exist
    const user = await User.findEmail(email);

    if (!user) {
      throw new ApiError(400, "user not found");
    }

    //compare password
    const match = await user.comparePassword(password);
    if (!match) {
      throw new ApiError(401, "invalid credential");
    }

    res.status(200).json({
      user: user.name,
      email: user.email,
      message: "login successfully!",
    });
  },
);

const forgetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send("forgetPassword");
  },
);

const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send("resetPassword");
  },
);

const changePassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send("changePassword");
  },
);

const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send("logout");
  },
);

export {
  register,
  login,
  forgetPassword,
  resetPassword,
  changePassword,
  logout,
};
