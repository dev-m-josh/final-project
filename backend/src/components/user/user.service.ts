// src/services/users.service.ts
import { eq } from "drizzle-orm";
import { db } from "../../drizzle/db";
import { UsersTable } from "../../drizzle/schema";

export const getAllUsers = async () => {
    return await db.select().from(UsersTable);
};

export const getUserById = async (id: number) => {
    const result = await db.select().from(UsersTable).where(eq(UsersTable.userId, id));
    return result[0] || null;
};

export const deleteUser = async (id: number) => {
    await db.delete(UsersTable).where(eq(UsersTable.userId, id));
};

export const updateUser = async (id: number, data: Partial<typeof UsersTable.$inferInsert>) => {
    const result = await db.update(UsersTable).set(data).where(eq(UsersTable.userId, id)).returning();
    return result[0] || null;
};

export const createUser = async (data: typeof UsersTable.$inferInsert) => {
    const result = await db.insert(UsersTable).values(data).returning();
    return result[0];
};
