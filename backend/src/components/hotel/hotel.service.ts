// src/services/hotel.service.ts
import { eq } from "drizzle-orm";
import { db } from "../../drizzle/db";
import { HotelsTable } from "../../drizzle/schema";

export const getAllHotels = async () => {
    return await db.select().from(HotelsTable);
};

export const getHotelById = async (id: number) => {
    const result = await db.select().from(HotelsTable).where(eq(HotelsTable.hotelId, id));
    return result[0] || null;
};

export const createHotel = async (hotelData: Omit<typeof HotelsTable.$inferInsert, "hotelId">) => {
    try {
    const result = await db.insert(HotelsTable).values(hotelData).returning();
        return result[0];
    }
    catch (error) {
        console.error("Error creating hotel:", error);
        throw error;
    }
};

export const updateHotel = async (id: number, data: Partial<typeof HotelsTable.$inferInsert>) => {
    const { createdAt, updatedAt, ...safeData } = data;

    const result = await db
        .update(HotelsTable)
        .set({ ...safeData, updatedAt: new Date() })
        .where(eq(HotelsTable.hotelId, id))
        .returning();

    return result[0] || null;
};


export const deleteHotel = async (id: number) => {
    await db.delete(HotelsTable).where(eq(HotelsTable.hotelId, id));
};

export const getHotelsByLocation = async (location: string) => {
    const result = await db.select().from(HotelsTable).where(eq(HotelsTable.location, location));
    return result[0] || null;
};
