import { Router } from "express";
import { getTokenERC20s, importTokenERC20, removeTokenERC20 } from "../controllers/token.controller.js";
import { authenticateToken } from "../utils/jwt.js";

const router = Router();

// erc20
router.post("/erc20/import", authenticateToken, importTokenERC20);
router.delete("/erc20/remove/:id/:account_id", authenticateToken, removeTokenERC20);
router.get("/erc20/:account_id", authenticateToken, getTokenERC20s);

export default router;