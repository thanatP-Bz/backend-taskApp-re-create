import { Router } from "express";
import passport from "../config/passport.js";
import { googleCallback } from "../controllers/oauthController.js";

const router = Router();

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  googleCallback,
);

export default router;
