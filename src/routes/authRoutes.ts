import express from "express";
import {
  register,
  login,
  forgetPassword,
  resetPassword,
  changePassword,
  logout,
} from "../controllers/authController.js";
import {
  verificationEmail,
  resendEmail,
} from "../controllers/emailController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify-email", verificationEmail);
router.post("/resend-email", resendEmail);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword); //do not forget token
router.patch("/change-password", changePassword);
router.post("/logout", logout);

export default router;
