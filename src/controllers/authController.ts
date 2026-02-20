import asyncHandler from "express-async-handler";
import { type Request, type Response, type NextFunction } from "express";
import { User } from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";

const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    //check validation
    if (!name || !email || !password) {
      throw new ApiError(400, "all field are required");
    }

    //check user exist
    const userExist = await User.findOne({ email });

    if (userExist) {
      throw new ApiError(400, "this email has already been in use");
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({ message: "register successfully!" });
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
