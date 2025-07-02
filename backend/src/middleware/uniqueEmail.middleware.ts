// src/middleware/uniqueEmail.middleware.ts
import { Request, Response, NextFunction } from "express";
import { db } from "../drizzle/db";
import { UsersTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const checkUniqueEmail = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.email) return next();
    const userId = Number(req.params.id); // used only in put

    const email = req.body.email.trim().toLowerCase();
    req.body.email = email;

    try {
        const existingUser = await db.select().from(UsersTable).where(eq(UsersTable.email, email));

        const foundUser = existingUser[0];

        // If creating a new user (POST), block if any user with same email exists
        if (!userId && foundUser) {
            return res.status(409).json({ message: "Email already exists" });
        }

        // If updating (PATCH), block if email belongs to a different user
        if (userId && foundUser && foundUser.userId !== userId) {
            return res.status(409).json({ message: "Email already in use by another user" });
        }

        next();
    } catch (error) {
        console.error("Email uniqueness check failed:", error);
        res.status(500).json({ message: "Server error while checking email" });
    }
};
