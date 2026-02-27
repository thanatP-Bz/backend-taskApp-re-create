import crypto from "crypto";

export const generateResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  return { resetToken, hashedResetToken };
};

export const hashedUpdateResetToken = (token: string) => {
  const hashed = crypto.createHash("sha256").update(token).digest("hex");

  return hashed;
};
