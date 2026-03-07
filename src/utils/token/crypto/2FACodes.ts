import crypto from "crypto";
import { ApiError } from "../../error/ApiError.js";
import type { IUserDocument } from "../../../types/user.js";

//generate 2FA codes
const generateBackUpCodes = (): string[] => {
  return Array.from({ length: 2 }, () =>
    crypto.randomBytes(4).toString("hex").toLocaleUpperCase(),
  );
};

export { generateBackUpCodes };
