import { Router } from "express";
import { sendCoin } from "../controllers/token.controller.js";

const router = Router();

router.post("/send-coin", sendCoin);

export default router;