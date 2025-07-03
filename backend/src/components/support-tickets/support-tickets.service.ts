// src/services/support-tickets.service.ts
import { eq } from "drizzle-orm";
import { db } from "../../drizzle/db";
import { SupportTicketsTable } from "../../drizzle/schema";

export const getAllTickets = async () => {
    return await db.select().from(SupportTicketsTable);
};

export const getTicketById = async (id: number) => {
    const result = await db.select().from(SupportTicketsTable).where(eq(SupportTicketsTable.ticketId, id));
    return result[0] || null;
};

export const createTicket = async (ticketData: Omit<typeof SupportTicketsTable.$inferInsert, "ticketId">) => {
    const result = await db.insert(SupportTicketsTable).values(ticketData).returning();
    return result[0];
};

export const updateTicket = async (id: number, data: Partial<typeof SupportTicketsTable.$inferInsert>) => {
    const result = await db
        .update(SupportTicketsTable)
        .set(data)
        .where(eq(SupportTicketsTable.ticketId, id))
        .returning();
    return result[0] || null;
};

export const deleteTicket = async (id: number) => {
    await db.delete(SupportTicketsTable).where(eq(SupportTicketsTable.ticketId, id));
};

export const getTicketByUserId = async (userId: number) => {
    const result = await db.select().from(SupportTicketsTable).where(eq(SupportTicketsTable.userId, userId));
    return result[0] || null;
};

export const getTicketByStatus = async (
    status: "Open" | "In Progress" | "Resolved" | "Closed"
) => {
    const result = await db.select().from(SupportTicketsTable).where(eq(SupportTicketsTable.status, status));
    return result[0] || null;
};
