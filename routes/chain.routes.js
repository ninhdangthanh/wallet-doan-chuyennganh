import express from "express";
import { getTxsByBlockNumber, getLatesBlockNumber } from "../controllers/chain.controller.js"; 

const router = express.Router();

router.get("/latest-block-number", getLatesBlockNumber); 
router.get("/txs/:blockNumber", getTxsByBlockNumber); 

export default router;
