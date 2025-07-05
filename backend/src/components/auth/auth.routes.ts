import express from "express";
import * as AuthController from "./auth.controller";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login as any);
router.post("/verify", AuthController.verify);

export default router;
