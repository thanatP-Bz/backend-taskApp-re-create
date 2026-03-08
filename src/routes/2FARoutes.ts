import { Router } from "express";
import { authenticate } from "../middleware/authentication/authMiddleware.js";
import {
  enable2FA,
  verify2FASetUp,
  verify2FALogin,
  disable2FAController,
} from "../controllers/2FAController.js";

const router = Router();

// Protected routes (require authentication)
router.post("/enable", authenticate, enable2FA);
router.post("/verify-setup", authenticate, verify2FASetUp);
router.post("/disable", authenticate, disable2FAController);

// Public route (no authentication needed)
router.post("/verify-2fa-login", verify2FALogin); // ← No middleware!

export default router;
