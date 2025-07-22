// src/services/bookings.service.ts
import { eq } from "drizzle-orm";
import { db } from "../../drizzle/db";
import { BookingsTable } from "../../drizzle/schema";

export const getAllBookings = async () => {
    return await db.select().from(BookingsTable);
};

export const getBookingById = async (id: number) => {
    const result = await db.select().from(BookingsTable).where(eq(BookingsTable.bookingId, id));
    return result[0] || null;
};

export const createBooking = async (bookingData: Omit<typeof BookingsTable.$inferInsert, "bookingId">) => {
    const result = await db.insert(BookingsTable).values(bookingData).returning();
    return result[0];
};

export const updateBooking = async (id: number, data: Partial<typeof BookingsTable.$inferInsert>) => {
    const result = await db.update(BookingsTable).set(data).where(eq(BookingsTable.bookingId, id)).returning();
    return result[0] || null;
};

export const deleteBooking = async (id: number) => {
    await db.delete(BookingsTable).where(eq(BookingsTable.bookingId, id));
};

export const getBookingsByUserId = async (userId: number) => {
    const result = await db.select().from(BookingsTable).where(eq(BookingsTable.userId, userId));
    return result;
};

export const getBookingsByStatus = async (status: true | false) => {
    const result = await db.select().from(BookingsTable).where(eq(BookingsTable.isConfirmed, status));
    return result;
};

export const setBookingStatus = async (bookingId: number) => {
    const result = await db
        .update(BookingsTable)
        .set({
            isConfirmed: true,
            updatedAt: new Date()
        })
        .where(eq(BookingsTable.bookingId, bookingId))
        .returning();
    return result[0] || null;
};
