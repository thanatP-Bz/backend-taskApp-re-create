import crypto from "crypto";

//generate 2FA codes
const generateBackUpCodes = (): string[] => {
  return Array.from({ length: 4 }, () =>
    crypto.randomBytes(4).toString("hex").toLocaleUpperCase(),
  );
};

export { generateBackUpCodes };
