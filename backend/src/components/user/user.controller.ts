// src/controllers/users.controller.ts
import { Request, Response } from "express";
import * as userService from "./user.service";
import { createUser } from './user.service';

export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id);
        const user = await userService.getUserById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Failed to fetch user" });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id);
        const user = await userService.getUserById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await userService.deleteUser(userId);
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Failed to delete user" });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id);
        const existingUser = await userService.getUserById(userId);

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const payload = {
            ...req.body,
            updatedAt: new Date()
        }

        const updatedUser = await userService.updateUser(userId, payload);
        res.json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Failed to update user" });
    }
};

export const createUserHandler = async (req: Request, res: Response) => {
    try {
        const newUser = await userService.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Failed to create user" });
    }
};