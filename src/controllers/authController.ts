import asyncHandler from "express-async-handler";
import { type Request, type Response, type NextFunction } from "express";

const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send("register");
  },
);

const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send("login");
  },
);

const verifyEmail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send("verifyEmail");
  },
);

const resendEmail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send("resendEmail");
  },
);

const forgetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send("forgetPassword");
  },
);

const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send("resetPassword");
  },
);

const changePassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send("changePassword");
  },
);

const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send("logout");
  },
);

export {
  register,
  login,
  verifyEmail,
  resendEmail,
  forgetPassword,
  resetPassword,
  changePassword,
  logout,
};
