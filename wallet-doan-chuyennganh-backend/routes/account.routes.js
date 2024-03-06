import { Router } from "express";
import { createAccount, removeAccount, changeNameAccount, addAccount, getAccountOfUser } from "../controllers/account.controller.js";

const router = Router();

router.post("/create", createAccount);
router.delete("/remove/:id", removeAccount);
router.patch("/change-name/:id", changeNameAccount);
router.post("/add", addAccount);
router.get("/", getAccountOfUser);


export default router;