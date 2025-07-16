// src/routes/users.route.ts
import express from "express";
import * as usersController from "./user.controller";
import { checkUniqueEmail } from "../../middleware/uniqueEmail.middleware";

const userRouter = express.Router();

userRouter.get("/", usersController.getAllUsers);
userRouter.get("/details/:id", usersController.getUserById as any);
userRouter.delete("/delete/:id", usersController.deleteUser as any);
userRouter.put("/update/:id", checkUniqueEmail as any, usersController.updateUser as any);
userRouter.post("/add", usersController.createUserHandler as any);

export default userRouter;
