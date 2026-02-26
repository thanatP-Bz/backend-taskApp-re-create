import asyncHandler from "express-async-handler";
import { type Request, type Response, type NextFunction } from "express";
import { ApiError } from "../utils/error/ApiError.js";
import { User } from "../models/userModel.js";
import { generateVerificationToken } from "../utils/token/generateVerificationToken.js";
import { resendVerificationEmailTemplate } from "../utils/email/emailTemplate.js";
import { sendEmail } from "../utils/email/sendEmail.js";

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
  user.verificationToken = null;
  user.verificationTokenExpires = null;
  await user.save();

  res
    .status(200)
    .json({ message: "Email verified successfully. You can now log in" });
});

const resendEmail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    // Validate email
    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    const user = await User.findEmail(email);

    // Check user exists
    if (!user) {
      throw new ApiError(400, "No account found with this email");
    }

    // Check if already verified
    if (user.isVerified) {
      throw new ApiError(400, "Email already verified. Please log in.");
    }

    // Cooldown check - prevent spam
    if (
      user.verificationTokenExpires &&
      user.verificationTokenExpires.getTime() > Date.now()
    ) {
      const minutesLeft = Math.ceil(
        (user.verificationTokenExpires.getTime() - Date.now()) / 60000,
      );
      throw new ApiError(
        429,
        `Please wait ${minutesLeft} minute(s) before requesting a new verification email`,
      );
    }

    // Generate new token
    const verificationToken = generateVerificationToken();
    const verificationTokenExpires = new Date(Date.now() + 1 * 60 * 1000);

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    // Send email with error handling
    try {
      const emailTemplates = resendVerificationEmailTemplate(
        verificationToken,
        user.email,
      );
      await sendEmail({
        to: user.email,
        ...emailTemplates,
      });
    } catch (error) {
      // Rollback token if email fails
      user.verificationToken = null;
      user.verificationTokenExpires = null;
      await user.save();

      throw new ApiError(500, "Failed to send email. Please try again.");
    }

    res.status(200).json({
      message: "Verification email sent. Please check your inbox.",
    });
  },
);

export { verificationEmail, resendEmail };
