// src/routes/users.route.ts
import express from "express";
import * as usersController from "./user.controller";
import { checkUniqueEmail } from "../../middleware/uniqueEmail.middleware";

const userRouter = express.Router();

userRouter.get("/", usersController.getAllUsers);
userRouter.get("/:id", usersController.getUserById as any);
userRouter.post("/", checkUniqueEmail as any, usersController.createUser);
userRouter.delete("/:id", usersController.deleteUser as any);
userRouter.put("/:id", checkUniqueEmail as any, usersController.updateUser as any);


export default userRouter;
