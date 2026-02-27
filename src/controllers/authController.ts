import asyncHandler from "express-async-handler";
import { type Request, type Response, type NextFunction } from "express";
import { User } from "../models/userModel.js";
import { ApiError } from "../utils/error/ApiError.js";
import { generateVerificationToken } from "../utils/token/crypto/verificationToken.js";
import {
  passwordResetEmailTemplate,
  passwordResetSuccessTemplate,
  verificationEmailTemplate,
} from "../utils/email/emailTemplate.js";
import { sendEmail } from "../utils/email/sendEmail.js";
import { generateAccessToken } from "../utils/token/JWT/accessToken.js";
import {
  generateResetToken,
  hashedUpdateResetToken,
} from "../utils/token/crypto/resetToken.js";
import bcrypt from "bcrypt";
import { generateRefreshToken } from "../utils/token/JWT/refreshToken.js";

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
    const emailTemplates = verificationEmailTemplate(
      verificationToken,
      user.email,
    );
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

    //generate access token
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = refreshToken;
    user.refreshTokenExpires = user.refreshTokenExpires = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    );
    user.save();

    res.status(200).json({
      user: user.name,
      email: user.email,
      message: "login successfully!",
      accessToken,
      refreshToken,
    });
  },
);

const forgetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const user = await User.findEmail(email);

    if (!user) {
      throw new ApiError(404, "No account found with this email");
    }

    //cookdown
    if (
      user.resetPasswordExpires &&
      user.resetPasswordExpires.getTime() > Date.now()
    ) {
      throw new ApiError(
        400,
        "Reset email already sent. Please check your inbox.",
      );
    }

    //generate token and Store token + expiry
    const { resetToken, hashedResetToken } = generateResetToken();

    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpires = new Date(Date.now() + 2 * 60 * 1000);

    await user.save();

    try {
      const emailTemplates = passwordResetEmailTemplate(resetToken, user.name);

      await sendEmail({ to: user.email, ...emailTemplates });

      res.status(200).json({ message: "Reset link sent" });
    } catch (error) {
      //set properties back to null
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;

      await user.save();

      throw new ApiError(500, "Failed to send reset email. Please try again.");
    }
  },
);

const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.query;
    const { newPassword } = req.body;

    // Validate token
    if (!token || typeof token !== "string") {
      throw new ApiError(400, "Invalid reset token");
    }

    // Validate new password
    if (!newPassword) {
      throw new ApiError(400, "New password is required");
    }

    const updatedUpdatedResetToken = hashedUpdateResetToken(token);

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: updatedUpdatedResetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new ApiError(400, "Invalid or expired reset token");
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    // ✅ Send confirmation email
    try {
      const emailTemplate = passwordResetSuccessTemplate(user.name);
      await sendEmail({
        to: user.email,
        ...emailTemplate,
      });
    } catch (error) {
      console.error("Failed to send confirmation email:", error);
      // Don't throw error - password was already reset successfully
    }

    res.status(200).json({
      message: "Password reset successful. You can now log in.",
    });
  },
);

const changePassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, oldPassword, newPassword } = req.body;

    const user = await User.findEmail(email);

    if (!user) {
      throw new ApiError(404, "User not Found");
    }

    //check old password match
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      throw new ApiError(400, "Password does not match");
    }

    if (oldPassword === newPassword) {
      throw new ApiError(
        400,
        "New password must be different from the old password",
      );
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password change successfully" });
  },
);

const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: "Logged out successfully" });
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
