import JWT, { type JwtPayload } from "jsonwebtoken";
import { ApiError } from "../../utils/error/ApiError.js";
import { type Request, type Response, type NextFunction } from "express";
import { User } from "../../models/userModel.js";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "Authorization is required");
  }

  try {
    const decoded = JWT.verify(
      token,
      process.env.JWT_ACCESS_SECRET!,
    ) as JwtPayload;

    if (!decoded._id) {
      throw new ApiError(401, "Invalid token playload");
    }

    console.log(decoded);

    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    req.user = user;
    next();
  } catch (error: any) {
    throw new ApiError(401, "Request is not authorized");
  }
};
