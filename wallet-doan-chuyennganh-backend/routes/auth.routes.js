import { Router } from "express";
import { forgotPassword, login, signin, changePassword } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", login);
router.post("/signup", signin);
router.post("/forgot-password", forgotPassword)
router.post("/change-password", changePassword)

export default router;