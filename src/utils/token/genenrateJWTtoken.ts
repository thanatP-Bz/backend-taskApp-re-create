import JWT from "jsonwebtoken";
import { ApiError } from "../error/ApiError.js";

export const generateAccessToken = (userId: string) => {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw new ApiError(400, `JWT access token is not defined`);
  }

  return JWT.sign({ _id: userId }, secret, {
    expiresIn: "15min",
  });
};
