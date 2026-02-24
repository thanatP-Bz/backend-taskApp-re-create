import crypto from "crypto";

export const generateResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString("hex");

  console.log("🔑 Step 1 - Plain token:", resetToken);

  const hashedResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log("🔑 Step 2 - Hashed token:", hashedResetToken);

  return { resetToken, hashedResetToken };
};

export const hashedUpdateResetToken = (token: string) => {
  console.log("🔐 Hashing incoming token:", token);

  const hashed = crypto.createHash("sha256").update(token).digest("hex");

  console.log("🔐 Result:", hashed);

  return hashed;
};
