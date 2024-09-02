import { Router } from "express";
import { forgotPassword, login, signin, changePassword } from "../controllers/auth.controller.js";
import { authenticateToken } from "../utils/jwt.js";

const router = Router();

router.post("/login", login);
router.post("/signup", signin);
router.post("/forgot-password", forgotPassword)
router.post("/change-password", authenticateToken, changePassword)

export default router;