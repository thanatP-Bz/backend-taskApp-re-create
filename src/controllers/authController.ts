import asyncHandler from "express-async-handler";
import { type Request, type Response, type NextFunction } from "express";
import { User } from "../models/userModel.js";
import { ApiError } from "../utils/error/ApiError.js";
import { generateVerificationToken } from "../utils/token/generateVerificationToken.js";
import {
  passwordResetEmailTemplate,
  verificationEmailTemplate,
} from "../utils/email/emailTemplate.js";
import { sendEmail } from "../utils/email/sendEmail.js";
import { generateAccessToken } from "../utils/token/genenrateJWTtoken.js";
import {
  generateResetToken,
  hashedUpdateResetToken,
} from "../utils/token/generateCryptoToken.js";

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

    res.status(200).json({
      user: user.name,
      email: user.email,
      message: "login successfully!",
      accessToken,
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

    //generate token and Store token + expiry
    const { resetToken, hashedResetToken } = generateResetToken();

    console.log("✅ Generated plain token:", resetToken);
    console.log("✅ Generated hashed token:", hashedResetToken);

    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    console.log("✅ Saved to DB - hashed token:", user.resetPasswordToken);
    console.log("✅ Saved to DB - expires:", user.resetPasswordExpires);

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

    console.log("🔍 Received token from URL:", token);
    console.log("🔍 Token type:", typeof token);

    // Validate token
    if (!token || typeof token !== "string") {
      throw new ApiError(400, "Invalid reset token");
    }

    // Validate new password
    if (!newPassword) {
      throw new ApiError(400, "New password is required");
    }

    const updatedUpdatedResetToken = hashedUpdateResetToken(token);
    console.log("🔍 Hashed incoming token:", updatedUpdatedResetToken);

    const userAny = await User.findOne({
      resetPasswordToken: updatedUpdatedResetToken,
    });
    console.log("🔍 User found (no expiry check)?", !!userAny);

    if (userAny) {
      console.log("🔍 DB token:", userAny.resetPasswordToken);
      console.log(
        "🔍 Tokens match?",
        userAny.resetPasswordToken === updatedUpdatedResetToken,
      );
      console.log("🔍 Expires at:", userAny.resetPasswordExpires);
      console.log("🔍 Now:", new Date());
    }

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

    res.status(200).json({
      message: "Password reset successful. You can now log in.",
    });
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
