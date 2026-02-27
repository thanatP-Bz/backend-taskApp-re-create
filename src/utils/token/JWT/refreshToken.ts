import jwt from "jsonwebtoken";
import { ApiError } from "../../error/ApiError.js";

export const generateRefreshToken = (userId: string) => {
  const secret = process.env.JWT_REFRESH_SECRET;

  if (!secret) {
    throw new ApiError(400, "secret is not defined check the .env file");
  }

  return jwt.sign({ _id: userId }, secret, {
    expiresIn: "7d",
  });
};

export const verifiedRefreshToken = (token: string) => {
  try {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) return null;
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    return null;
  }
};
