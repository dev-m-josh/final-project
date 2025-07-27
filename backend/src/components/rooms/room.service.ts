// src/services/rooms.service.ts
import { eq, and } from "drizzle-orm";
import { db } from "../../drizzle/db";
import { RoomsTable } from "../../drizzle/schema";

export const getAllRooms = async () => {
    return await db.select().from(RoomsTable);
};

export const getRoomById = async (id: number) => {
    const result = await db.select().from(RoomsTable).where(eq(RoomsTable.roomId, id));
    return result[0] || null;
};

export const createRoom = async (roomData: Omit<typeof RoomsTable.$inferInsert, "roomId">) => {
    const result = await db.insert(RoomsTable).values(roomData).returning();
    return result[0];
};

export const updateRoom = async (id: number, data: Partial<typeof RoomsTable.$inferInsert>) => {
    const result = await db.update(RoomsTable).set(data).where(eq(RoomsTable.roomId, id)).returning();
    return result[0] || null;
};

export const deleteRoom = async (id: number) => {
    await db.delete(RoomsTable).where(eq(RoomsTable.roomId, id));
};

export const getRoomsByHotelId = async (hotelId: number) => {
    const result = await db.select().from(RoomsTable).where(eq(RoomsTable.hotelId, hotelId));
    return result;
};

//get rooms by hotelid and room isAvailable === true
export const getAvailableRoomsByHotelIdService = async (hotelId: number) => {
    const result = await db
        .select()
        .from(RoomsTable)
        .where(and(eq(RoomsTable.hotelId, hotelId), eq(RoomsTable.isAvailable, true)));

    return result;
};
