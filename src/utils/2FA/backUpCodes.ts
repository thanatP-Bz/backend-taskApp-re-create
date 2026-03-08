import crypto from "crypto";
import { ApiError } from "../error/ApiError.js";
import type { IUserDocument } from "../../types/user.js";

//hash backup code for storage
const hashedBackupCode = (code: string): string => {
  return crypto.createHash("sha256").update(code).digest("hex");
};

const verifyBackupCode = async (
  user: IUserDocument,
  code: string,
): Promise<boolean> => {
  const hashedCode = hashedBackupCode(code);

  if (!user.backupCodes || user.backupCodes.length === 0) {
    throw new ApiError(
      400,
      "No backup codes available. Please use your authenticator app.",
    );
  }

  const index = user.backupCodes?.findIndex(
    (storeCode: string) => storeCode === hashedCode,
  );

  if (index === -1 || index === undefined) {
    throw new ApiError(400, "Invalid back up code");
  }

  //remove use backup code
  user.backupCodes.splice(index, 1);
  await user.save();

  if (user.backupCodes.length <= 2) {
    // You could return this warning in the login response
    console.warn(
      `User ${user.email} has only ${user.backupCodes.length} backup codes left`,
    );
  }

  return true;
};

export { hashedBackupCode, verifyBackupCode };
