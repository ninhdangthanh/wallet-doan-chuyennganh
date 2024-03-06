import { Router } from "express";
import { getTokenERC20s, importTokenERC20, removeTokenERC20 } from "../controllers/token.controller.js";

const router = Router();

// erc20
router.post("/erc20/import", importTokenERC20);
router.delete("/erc20/remove/:id/:account_id", removeTokenERC20);
router.get("/erc20/:network_id/:account_id", getTokenERC20s);

// erc721



export default router;