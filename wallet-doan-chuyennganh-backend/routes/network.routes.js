import { Router } from "express";
import { createNetwork, removeNetwork, getNetworkOfUser } from "../controllers/network.controller.js";

const router = Router();

router.post("/create", createNetwork);
router.delete("/remove/:id", removeNetwork);
router.get("/", getNetworkOfUser);

export default router;