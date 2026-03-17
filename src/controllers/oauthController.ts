import type { Request, Response } from "express";
import type { IUserDocument } from "../types/user.js";
import { generateAccessToken } from "../utils/token/JWT/accessToken.js";
import { generateRefreshToken } from "../utils/token/JWT/refreshToken.js";
import { createSession } from "./redisSessionController.js";

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUserDocument;

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_user`);
    }

    //gererate refresh token
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    //save new token to database
    user.refreshToken = refreshToken;
    user.refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await user.save();

    // Create session for OAuth login
    const session = await createSession({
      userId: user._id.toString(),
      ipAddress: req.ip || req.socket.remoteAddress || "unknown",
      userAgent: req.headers["user-agent"] || "unknown",
    });

    /*    console.log("test");

    return res.json({
      success: true,
      accessToken,
      refreshToken,
      sessionId: session,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        authProvider: user.authProvider,
      },
    }); */

    // Encode user data
    const userData = encodeURIComponent(
      JSON.stringify({
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        authProvider: user.authProvider,
      }),
    );

    // ✅ Simple redirect with all data in URL
    const redirectUrl = `${process.env.FRONTEND_URL}/oauth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}&sessionId=${session}&user=${userData}`;

    res.redirect(redirectUrl);
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
  }
};
