import { type JwtPayload } from "jsonwebtoken";
import { ApiError } from "../../utils/error/ApiError.js";
import { type Request, type Response, type NextFunction } from "express";
import { User } from "../../models/userModel.js";
import { verifiedAccessToken } from "../../utils/token/JWT/accessToken.js";

import {
  isSessionValid,
  updateSessionActivity,
} from "../../controllers/redisSessionController.js";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  const sessionId = req.headers["x-session-id"] as string;

  console.log(sessionId);

  if (!sessionId) throw new ApiError(401, "Session is missing");
  if (!token) throw new ApiError(401, "Authorization is required");

  try {
    const decoded = verifiedAccessToken(token) as JwtPayload;

    if (!decoded._id) {
      throw new ApiError(401, "Invalid token playload");
    }

    // validate session in Redis
    const sessionValid = await isSessionValid(sessionId);

    if (!sessionValid) {
      throw new ApiError(401, `session is expired please log in again`);
    }

    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    updateSessionActivity(sessionId);

    req.user = user;
    next();
  } catch (error: any) {
    throw new ApiError(401, error.message);
  }
};
