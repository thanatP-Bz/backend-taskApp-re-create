import expressAsyncHandler from "express-async-handler";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import type { Request, Response } from "express";
import { User } from "../models/userModel.js";
import { ApiError } from "../utils/error/ApiError.js";
import type { IUserDocument } from "../types/user.js";
import { hashedBackupCode } from "../utils/2FA/backUpCodes.js";
import { generateBackUpCodes } from "../utils/token/crypto/2FACodes.js";
import { verify2FATokenService } from "../utils/2FA/verified2FATOken.js";
import { createSession } from "./redisSessionController.js";
import { generateAccessToken } from "../utils/token/JWT/accessToken.js";
import { generateRefreshToken } from "../utils/token/JWT/refreshToken.js";

//enable 2 Fa
export const enable2FA = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as IUserDocument;

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.twoFactorEnabled) {
      throw new ApiError(400, "2FA is already enable");
    }

    //gererate QR code
    const secret = speakeasy.generateSecret({
      name: `TaskApp (${user.email})`,
      issuer: "TaskApp",
    });

    user.twoFactorSecret = secret.base32;
    await user.save();
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!);

    res.status(200).json({
      secret: secret.base32,
      qrCode: qrCodeUrl,
      message: "Scan QR code with your authenticator to verify with the code",
    });
  },
);

//verify 2FA set up
export const verify2FASetUp = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as IUserDocument;
    const email = user?.email;
    const { token } = req.body;

    if (!email) {
      throw new ApiError(401, "Unthorized");
    }

    if (!token) {
      throw new ApiError(400, "Token is required");
    }

    if (!user.twoFactorSecret) {
      throw new ApiError(
        400,
        "2FA set up is not initiated, Please enable 2FA first",
      );
    }

    if (user.twoFactorEnabled) {
      throw new ApiError(400, "2FA is already enable");
    }

    //verify the token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: token,
      window: 2,
    });

    if (!verified) {
      throw new ApiError(400, "token is invalid");
    }

    //generate back up codes
    const backupCodes = generateBackUpCodes();

    //enable 2FA
    user.twoFactorEnabled = true;
    user.backupCodes = backupCodes.map((code) => hashedBackupCode(code));
    await user.save();

    res.status(200).json({ backupCodes, message: "2FA enable successfully" });
  },
);

//verify2FA login
export const verify2FALogin = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { userId, token } = req.body;

    if (!userId) {
      throw new ApiError(400, "User ID is required");
    }

    if (!token) {
      throw new ApiError(400, "2FA token is required");
    }

    //check userId
    const user = (await User.findById(userId)) as IUserDocument;
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    //verify 2FA token
    const isValid = await verify2FATokenService(user, token);
    if (!isValid) {
      throw new ApiError(400, "Invalid 2FA token");
    }

    //generate session id
    const sessionId = await createSession({
      userId: user._id,
      ipAddress: req.ip!,
      userAgent: req.headers["user-agent"] || "unknown",
    });

    //generate access token
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = refreshToken;
    user.refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    user.save();

    res.status(200).json({
      message: "login successfully!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        twoFactorEnabled: true,
      },
      sessionId,
      accessToken,
      refreshToken,
    });
  },
);

//disable 2FA
export const disable2FAController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const authenticatedUser = req.user as IUserDocument;
    const user = await User.findById(authenticatedUser._id).select("+password");
    const { password } = req.body;

    if (!password) {
      throw new ApiError(401, "Password is required");
    }

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Check if user has a password (not OAuth user)
    if (!user.password) {
      throw new ApiError(
        400,
        "Cannot verify password. This account uses OAuth login.",
      );
    }

    //check password match
    const match = await user.comparePassword(password);

    if (!match) {
      throw new ApiError(400, "Incorrect password");
    }

    //disable 2FA and clean up all 2FA data
    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    user.backupCodes = [];
    await user.save();

    res
      .status(200)
      .json({ message: "2FA is disabled", twoFactorEnabled: false });
  },
);
