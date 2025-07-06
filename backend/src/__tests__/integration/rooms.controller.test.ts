// src/__tests__/integration-Test/room.controller.test.ts
import request from "supertest";
import express from "express";
import {
    getAllRooms,
    getRoomById,
    createRoom,
    deleteRoom,
    updateRoom,
    getRoomsByHotelId,
} from "../../components/rooms/room.controller";
import * as RoomService from "../../components/rooms/room.service";

const app = express();
app.use(express.json());

app.get("/rooms", getAllRooms as any);
app.get("/rooms/:id", getRoomById as any);
app.get("/rooms/hotel/:hotelId", getRoomsByHotelId as any);
app.post("/rooms", createRoom as any);
app.put("/rooms/:id", updateRoom as any);
app.delete("/rooms/:id", deleteRoom as any);

jest.mock("../../components/rooms/room.service");

beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
});

describe("Room Controller - Integration Tests", () => {
    const mockRoom = {
        roomId: 1,
        hotelId: 1,
        roomType: "Deluxe",
        pricePerNight: "120.00",
        capacity: 2,
        amenities: "Wi-Fi, TV, AC",
        isAvailable: true,
        createdAt: new Date().toISOString(),
    };

    test("GET /rooms should return all rooms", async () => {
        (RoomService.getAllRooms as jest.Mock).mockResolvedValue([mockRoom]);
        const res = await request(app).get("/rooms");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([mockRoom]);
    });

    test("GET /rooms/:id should return a single room", async () => {
        (RoomService.getRoomById as jest.Mock).mockResolvedValue(mockRoom);
        const res = await request(app).get("/rooms/1");
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockRoom);
    });

    test("GET /rooms/:id should return 400 for invalid ID", async () => {
        const res = await request(app).get("/rooms/invalid");
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: "Invalid room ID" });
    });

    test("GET /rooms/:id should return 404 if room not found", async () => {
        (RoomService.getRoomById as jest.Mock).mockResolvedValue(null);
        const res = await request(app).get("/rooms/999");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Room not found" });
    });

    test("POST /rooms should create a room", async () => {
        (RoomService.createRoom as jest.Mock).mockResolvedValue(mockRoom);
        const res = await request(app).post("/rooms").send(mockRoom);
        expect(res.status).toBe(201);
        expect(res.body).toEqual(mockRoom);
    });

    test("PUT /rooms/:id should update a room", async () => {
        (RoomService.getRoomById as jest.Mock).mockResolvedValue(mockRoom);
        (RoomService.updateRoom as jest.Mock).mockResolvedValue({ ...mockRoom, roomType: "Updated Type" });
        const res = await request(app).put("/rooms/1").send({ roomType: "Updated Type" });
        expect(res.status).toBe(200);
        expect(res.body.roomType).toBe("Updated Type");
    });

    test("PUT /rooms/:id should return 404 if room not found", async () => {
        (RoomService.getRoomById as jest.Mock).mockResolvedValue(null);
        const res = await request(app).put("/rooms/1").send({ roomType: "Updated" });
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Room not found" });
    });

    test("DELETE /rooms/:id should delete a room", async () => {
        (RoomService.getRoomById as jest.Mock).mockResolvedValue(mockRoom);
        (RoomService.deleteRoom as jest.Mock).mockResolvedValue(undefined);
        const res = await request(app).delete("/rooms/1");
        expect(res.status).toBe(204);
    });

    test("DELETE /rooms/:id should return 404 if room not found", async () => {
        (RoomService.getRoomById as jest.Mock).mockResolvedValue(null);
        const res = await request(app).delete("/rooms/1");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Room not found" });
    });

    test("GET /rooms/hotel/:hotelId should return rooms by hotel ID", async () => {
        (RoomService.getRoomsByHotelId as jest.Mock).mockResolvedValue([mockRoom]);
        const res = await request(app).get("/rooms/hotel/1");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([mockRoom]);
    });

    test("GET /rooms/hotel/:hotelId should return 400 if invalid hotel ID", async () => {
        const res = await request(app).get("/rooms/hotel/invalid");
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: "Invalid user ID" });
    });

    test("should handle errors and return 500", async () => {
        (RoomService.getAllRooms as jest.Mock).mockRejectedValue(new Error("DB error"));
        const res = await request(app).get("/rooms");
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to fetch rooms" });
    });
    test("GET /rooms should return 500 on service error", async () => {
    (RoomService.getAllRooms as jest.Mock).mockRejectedValue(new Error("DB error"));
    const res = await request(app).get("/rooms");
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to fetch rooms" });
    });

    test("POST /rooms should return 500 on service error", async () => {
        (RoomService.createRoom as jest.Mock).mockRejectedValue(new Error("DB error"));
        const res = await request(app).post("/rooms").send({});
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to create room" });
    });

    test("PUT /rooms/:id should return 500 on service error", async () => {
        (RoomService.getRoomById as jest.Mock).mockResolvedValue(mockRoom);
        (RoomService.updateRoom as jest.Mock).mockRejectedValue(new Error("DB error"));
        const res = await request(app).put("/rooms/1").send({ roomType: "Updated" });
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to update room" });
    });

    test("DELETE /rooms/:id should return 500 on service error", async () => {
        (RoomService.getRoomById as jest.Mock).mockResolvedValue(mockRoom);
        (RoomService.deleteRoom as jest.Mock).mockRejectedValue(new Error("DB error"));
        const res = await request(app).delete("/rooms/1");
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to delete room" });
    });

    test("GET /rooms/:id should return 500 on service error", async () => {
        (RoomService.getRoomById as jest.Mock).mockRejectedValue(new Error("DB error"));
        const res = await request(app).get("/rooms/1");
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to fetch room" });
    });

    test("GET /rooms/hotel/:hotelId should return 500 on service error", async () => {
        (RoomService.getRoomsByHotelId as jest.Mock).mockRejectedValue(new Error("DB error"));
        const res = await request(app).get("/rooms/hotel/1");
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to fetch rooms by hotel" });
    });

});
