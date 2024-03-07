import { Router } from "express";
import { getNFTofAccount, getTokenERC20s, importTokenERC20, importTokenERC721, removeNFT, removeTokenERC20 } from "../controllers/token.controller.js";

const router = Router();

// erc20
router.post("/erc20/import", importTokenERC20);
router.delete("/erc20/remove/:id/:account_id", removeTokenERC20);
router.get("/erc20/:network_id/:account_id", getTokenERC20s);

// erc721
router.post("/erc721/import", importTokenERC721);
router.delete("/erc721/remove/:account_id/:nft_id", removeNFT);
router.get("/erc721/:account_id", getNFTofAccount);

export default router;