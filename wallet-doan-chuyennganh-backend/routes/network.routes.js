import { Router } from "express";
import { createNetwork, removeNetwork } from "../controllers/network.controller.js";

const router = Router();

router.post("/create", createNetwork);
router.delete("/remove/:id", removeNetwork);

export default router;