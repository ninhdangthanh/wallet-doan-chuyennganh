import { Router } from "express";
import { createAccount } from "../controllers/account.controller.js";

const router = Router();

router.post("/create-account", createAccount);

export default router;