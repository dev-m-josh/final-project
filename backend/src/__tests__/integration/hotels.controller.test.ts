import request from "supertest";
import express from "express";
import {
    getAllHotels,
    getHotelById,
    createHotel,
    updateHotel,
    deleteHotel,
    getHotelsByLocation,
} from "../../components/hotel/hotel.controller";
import * as HotelService from "../../components/hotel/hotel.service";

const app = express();
app.use(express.json());

app.get("/hotels", getAllHotels as any);
app.get("/hotels/:id", getHotelById as any);
app.get("/hotels/location/:location", getHotelsByLocation as any);
app.post("/hotels", createHotel as any);
app.put("/hotels/:id", updateHotel as any);
app.delete("/hotels/:id", deleteHotel as any);

jest.mock("../../components/hotel/hotel.service");

beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
});

const mockHotel = {
    hotelId: 1,
    name: "Test Hotel",
    location: "Nairobi",
    address: "123 Street",
    contactPhone: "0712345678",
    category: "Luxury",
    rating: "5",
    imageUrl: "https://example.com/image.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

describe("Hotel Controller - Integration Tests", () => {
    test("GET /hotels - should return all hotels", async () => {
        (HotelService.getAllHotels as jest.Mock).mockResolvedValue([mockHotel]);
        const res = await request(app).get("/hotels");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([mockHotel]);
    });

    test("GET /hotels/:id - should return a single hotel", async () => {
        (HotelService.getHotelById as jest.Mock).mockResolvedValue(mockHotel);
        const res = await request(app).get("/hotels/1");
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockHotel);
    });

    test("GET /hotels/:id - should return 400 for invalid ID", async () => {
        const res = await request(app).get("/hotels/invalid");
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: "Invalid hotel ID" });
    });

    test("POST /hotels - should create a hotel", async () => {
        (HotelService.createHotel as jest.Mock).mockResolvedValue(mockHotel);
        const res = await request(app).post("/hotels").send(mockHotel);
        expect(res.status).toBe(201);
        expect(res.body).toEqual(mockHotel);
    });

    test("PUT /hotels/:id - should update a hotel", async () => {
        (HotelService.getHotelById as jest.Mock).mockResolvedValue(mockHotel);
        (HotelService.updateHotel as jest.Mock).mockResolvedValue({ ...mockHotel, name: "Updated" });
        const res = await request(app).put("/hotels/1").send({ name: "Updated" });
        expect(res.status).toBe(200);
        expect(res.body.name).toBe("Updated");
    });

    test("PUT /hotels/:id - should return 400 for invalid ID", async () => {
        const res = await request(app).put("/hotels/invalid");
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: "Invalid hotel ID" });
    });

    test("PUT /hotels/:id - should return 404 if not found", async () => {
        (HotelService.getHotelById as jest.Mock).mockResolvedValue(null);
        const res = await request(app).put("/hotels/1").send({ name: "Update" });
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Hotel not found" });
    });

    test("DELETE /hotels/:id - should delete a hotel", async () => {
        (HotelService.getHotelById as jest.Mock).mockResolvedValue(mockHotel);
        (HotelService.deleteHotel as jest.Mock).mockResolvedValue(undefined);
        const res = await request(app).delete("/hotels/1");
        expect(res.status).toBe(204);
    });

    test("DELETE /hotels/:id - should return 404 if hotel not found", async () => {
        (HotelService.getHotelById as jest.Mock).mockResolvedValue(null);
        const res = await request(app).delete("/hotels/1");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Hotel not found" });
    });

    test("DELETE /hotels/:id - should return 400 for invalid ID", async () => {
        const res = await request(app).delete("/hotels/invalid");
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: "Invalid hotel ID" });
    });

    test("GET /hotels/location/:location - should return hotels by location", async () => {
        (HotelService.getHotelsByLocation as jest.Mock).mockResolvedValue([mockHotel]);
        const res = await request(app).get("/hotels/location/Nairobi");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([mockHotel]);
    });

    // --- Error cases ---
    test("GET /hotels - should return 500 on error", async () => {
        (HotelService.getAllHotels as jest.Mock).mockRejectedValue(new Error("DB error"));
        const res = await request(app).get("/hotels");
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to fetch hotels" });
    });

    test("POST /hotels - should return 500 on error", async () => {
        (HotelService.createHotel as jest.Mock).mockRejectedValue(new Error("DB error"));
        const res = await request(app).post("/hotels").send(mockHotel);
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to create hotel" });
    });

    test("PUT /hotels/:id - should return 500 on error", async () => {
        (HotelService.getHotelById as jest.Mock).mockResolvedValue(mockHotel);
        (HotelService.updateHotel as jest.Mock).mockRejectedValue(new Error("DB error"));
        const res = await request(app).put("/hotels/1").send({ name: "Fail" });
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to update hotel" });
    });

    test("DELETE /hotels/:id - should return 500 on error", async () => {
        (HotelService.getHotelById as jest.Mock).mockResolvedValue(mockHotel);
        (HotelService.deleteHotel as jest.Mock).mockRejectedValue(new Error("DB error"));
        const res = await request(app).delete("/hotels/1");
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to delete hotel" });
    });

    test("GET /hotels/:id - should return 500 on error", async () => {
        (HotelService.getHotelById as jest.Mock).mockRejectedValue(new Error("DB error"));
        const res = await request(app).get("/hotels/1");
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to fetch hotel" });
    });

    test("GET /hotels/location/:location - should return 500 on error", async () => {
        (HotelService.getHotelsByLocation as jest.Mock).mockRejectedValue(new Error("DB error"));
        const res = await request(app).get("/hotels/location/Nairobi");
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to fetch hotels by location" });
    });
});
