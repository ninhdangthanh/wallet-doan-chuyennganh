import { Router } from "express";
import { createAccount, removeAccount, changeNameAccount, addAccount, getAccountOfUser, showPrivateKey } from "../controllers/account.controller.js";

const router = Router();

router.post("/create", createAccount);
router.delete("/remove/:id", removeAccount);
router.patch("/change-name/:id", changeNameAccount);
router.post("/add", addAccount);
router.get("/", getAccountOfUser);
router.post("/show-private-key", showPrivateKey);


export default router;