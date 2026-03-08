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
import { googleCallback } from "../controllers/oauthController.js";
import { authenticate } from "../middleware/authentication/authMiddleware.js";
import { rateLimiter } from "../middleware/rate-limit/rate-limiter.js";

const router = express.Router();

router.post("/register", rateLimiter("register"), register);
router.post("/login", rateLimiter("login"), login);
router.get("/verify-email", verificationEmail);
router.post("/resend-email", resendEmail);
router.post("/forget-password", rateLimiter("forgetPassword"), forgetPassword);
router.post("/reset-password", resetPassword);
router.patch("/change-password", authenticate, changePassword);
router.post("/logout", logout);

//oauth token route
router.post("/google", googleCallback);

export default router;
