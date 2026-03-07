import { Router } from "express";
import { authenticate } from "../middleware/authentication/authMiddleware.js";
import { enable2FA, verify2FASetUp } from "../controllers/2FAController.js";

const router = Router();

router.use(authenticate);

router.post("/enable", enable2FA);
router.post("/verify-setup", verify2FASetUp);

export default router;
