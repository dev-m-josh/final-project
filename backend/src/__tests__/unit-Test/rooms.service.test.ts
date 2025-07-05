import * as RoomService from "../../components/rooms/room.service";
import { db } from "../../drizzle/db";

// Mock the db module
jest.mock("../../drizzle/db", () => ({
    db: {
        select: jest.fn(),
        insert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));

const mockRoom = {
    roomId: 1,
    hotelId: 1,
    roomType: "Deluxe",
    pricePerNight: "150.00",
    capacity: 2,
    amenities: "WiFi, AC",
    isAvailable: true,
    createdAt: new Date("2025-07-05T20:24:10.244Z"),
};

describe("Room Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("getAllRooms should return all rooms", async () => {
        (db.select as jest.Mock).mockReturnValue({
            from: jest.fn().mockResolvedValue([mockRoom]),
        });

        const result = await RoomService.getAllRooms();
        expect(result).toEqual([mockRoom]);
    });

    test("getRoomById should return a single room", async () => {
        (db.select as jest.Mock).mockReturnValue({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([mockRoom]),
            }),
        });

        const result = await RoomService.getRoomById(1);
        expect(result).toEqual(mockRoom);
    });

    test("getRoomById should return null if room not found", async () => {
        (db.select as jest.Mock).mockReturnValue({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([]),
            }),
        });

        const result = await RoomService.getRoomById(999);
        expect(result).toBeNull();
    });

    test("getRoomsByHotelId should return rooms of a hotel", async () => {
        (db.select as jest.Mock).mockReturnValue({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([mockRoom]),
            }),
        });

        const result = await RoomService.getRoomsByHotelId(1);
        expect(result).toEqual([mockRoom]);
    });

    test("createRoom should insert and return the created room", async () => {
        (db.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValue([mockRoom]),
            }),
        });

        const result = await RoomService.createRoom(mockRoom);
        expect(result).toEqual(mockRoom);
    });

    test("updateRoom should return the updated room", async () => {
        (db.update as jest.Mock).mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue([mockRoom]),
                }),
            }),
        });

        const result = await RoomService.updateRoom(1, { roomType: "Updated" });
        expect(result).toEqual(mockRoom);
    });

    test("deleteRoom should call db.delete().where()", async () => {
        const whereSpy = jest.fn().mockResolvedValue(undefined);
        (db.delete as jest.Mock).mockReturnValueOnce({ where: whereSpy });

        await RoomService.deleteRoom(1);
        expect(whereSpy).toHaveBeenCalledWith(expect.anything());
    });
});
