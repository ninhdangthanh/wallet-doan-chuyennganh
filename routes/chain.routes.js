import express from "express";
import { getTxsByBlockNumber, getTxsDetail } from "../controllers/chain.controller.js"; 

const router = express.Router();

router.get("/block/:blockNumber", getTxsDetail); 
router.get("/txs/:blockNumber", getTxsByBlockNumber); 

export default router;
