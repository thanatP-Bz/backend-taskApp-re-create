import expressAsyncHandler from "express-async-handler";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import type { Request, Response } from "express";
import { User } from "../models/userModel.js";
import { ApiError } from "../utils/error/ApiError.js";
import type { IUserDocument } from "../types/user.js";
import {
  hashedBackupCode,
  verifyBackupCode,
} from "../utils/2FA/backUpCodes.js";
import { generateBackUpCodes } from "../utils/token/crypto/2FACodes.js";

//enable 2 Fa
export const enable2FA = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.findEmail(email);

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

//verify 2FA Token
export const verify2FAToken = async (
  req: Request,
  res: Response,
): Promise<boolean> => {
  const user = req.user as IUserDocument;

  const { token } = req.body;

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.twoFactorEnabled || !user.twoFactorSecret) {
    return verifyBackupCode(user as IUserDocument, token);
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

  return true;
};
