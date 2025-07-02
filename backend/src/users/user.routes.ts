// src/routes/users.route.ts
import express from "express";
import * as usersController from "./user.controller";
import { checkUniqueEmail } from "../middleware/uniqueEmail.middleware";

const router = express.Router();

router.get("/", usersController.getAllUsers);
router.get("/:id", usersController.getUserById as any);
router.post("/", checkUniqueEmail as any, usersController.createUser);
router.delete("/:id", usersController.deleteUser as any);
router.put("/:id", checkUniqueEmail as any, usersController.updateUser as any);


export default router;
