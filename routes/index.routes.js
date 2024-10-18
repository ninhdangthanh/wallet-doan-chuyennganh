import { Router } from "express";

import { authenticateToken } from "../utils/jwt.js";

import authRoutes from "./auth.routes.js"
import accountRoutes from "./account.routes.js"
import coinRoutes from "./coin.routes.js"
import activityRoutes from "./activity.routes.js"
import tokenRoutes from "./token.routes.js"
import chainRoutes from "./chain.routes.js"

const router = Router();

// routes
router.use("/hello", async (req, res) => {
    try {
        return res.json("hello backend wallet");
    } catch (error) {}
});

router.use("/api/auth", authRoutes);
router.use("/api/account", authenticateToken, accountRoutes);
router.use("/api/coin", authenticateToken, coinRoutes);
router.use("/api/token", tokenRoutes);
router.use("/api/activities", activityRoutes);
router.use("/api/chain", chainRoutes);

export default router;