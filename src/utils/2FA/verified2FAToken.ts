import { verifyBackupCode } from "./backUpCodes.js";
import speakeasy from "speakeasy";
import type { Request, Response } from "express";
import { ApiError } from "../error/ApiError.js";
import type { IUserDocument } from "../../types/user.js";

// Service function - takes user and token directly
export const verify2FATokenService = async (
  user: IUserDocument,
  token: string,
): Promise<boolean> => {
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.twoFactorEnabled || !user.twoFactorSecret) {
    console.log("Using backup code verification");

    return verifyBackupCode(user, token);
  }

  // Verify the token
  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token: token,
    window: 2,
  });

  if (!verified) {
    throw new ApiError(400, "Token is invalid");
  }

  return true;
};

// Keep the existing controller version for middleware routes
export const verify2FAToken = async (
  req: Request,
  res: Response,
): Promise<boolean> => {
  const user = req.user as IUserDocument;
  const { token } = req.body;

  return verify2FATokenService(user, token);
};
