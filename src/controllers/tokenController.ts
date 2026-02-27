import type { JwtPayload } from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { ApiError } from "../utils/error/ApiError.js";
import {
  generateRefreshToken,
  verifiedRefreshToken,
} from "../utils/token/JWT/refreshToken.js";
import { generateAccessToken } from "../utils/token/JWT/accessToken.js";
import expressAsyncHandler from "express-async-handler";
import type { Request, Response, NextFunction } from "express";

export const refreshToken = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new ApiError(401, "refresh token is required");
    }

    const decoded = verifiedRefreshToken(refreshToken) as JwtPayload;

    if (!decoded) {
      throw new ApiError(401, "Invalid refresh token");
    }

    //check if user exist
    const userExist = await User.findById(decoded._id);
    if (!userExist) {
      throw new ApiError(400, "User not found");
    }

    //check refresh token vaild
    const user = await User.findOne({
      _id: decoded._id,
      refreshToken: refreshToken,
      refreshTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    //generate new token
    const newAccessToken = generateAccessToken(user._id.toString());
    const newRefreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = newRefreshToken;
    user.refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await user.save();

    res
      .status(200)
      .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  },
);
