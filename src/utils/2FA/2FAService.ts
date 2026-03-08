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

  if (!user.twoFactorEnabled) {
    throw new ApiError(400, "2FA is not enabled");
  }

  // Check token length to determine type
  if (token.length === 8) {
    // Backup code (8 characters) - single use
    console.log("Using backup code verification");
    return verifyBackupCode(user, token);
  } else if (token.length === 6) {
    // TOTP code (6 digits) - verify with secret
    if (!user.twoFactorSecret) {
      throw new ApiError(400, "2FA secret not found");
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: token,
      window: 2,
    });

    if (!verified) {
      throw new ApiError(400, "Invalid 2FA code");
    }

    return true;
  } else {
    // Invalid token length
    throw new ApiError(
      400,
      "Invalid token format. Use 6-digit code or 8-character backup code",
    );
  }
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
