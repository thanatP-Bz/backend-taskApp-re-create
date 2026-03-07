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
    throw new ApiError(400, "No backup code Available");
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

  return true;
};

export { hashedBackupCode, verifyBackupCode };
