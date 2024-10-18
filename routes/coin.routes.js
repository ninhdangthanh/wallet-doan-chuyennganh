import { Router } from "express";
import { sendCoin } from "../controllers/coin.controller.js";

const router = Router();

router.post("/send-coin", sendCoin);

export default router;