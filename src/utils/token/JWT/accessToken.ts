import jwt from "jsonwebtoken";
import { ApiError } from "../../error/ApiError.js";

export const generateAccessToken = (userId: string) => {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw new ApiError(400, `JWT access token is not defined`);
  }

  return jwt.sign({ _id: userId }, secret, {
    expiresIn: "1min",
  });
};

export const verifiedAccessToken = (token: string) => {
  try {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) return null;

    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};
