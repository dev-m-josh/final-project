import request from "supertest";
import express from "express";
import {
    getAllHotels,
    getHotelById,
    createHotel,
    updateHotel,
    deleteHotel,
} from "../../components/hotel/hotel.controller";
import * as HotelService from "../../components/hotel/hotel.service";

const app = express();
app.use(express.json());
app.get("/hotels", getAllHotels as any);
app.get("/hotels/:id", getHotelById as any);
app.post("/hotels", createHotel as any);
app.patch("/hotels/:id", updateHotel as any);
app.delete("/hotels/:id", deleteHotel as any);

jest.mock("../../components/hotel/hotel.service");

describe("Hotel Controller - Integration Tests", () => {
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

    test("GET /hotels should return a list of hotels", async () => {
        (HotelService.getAllHotels as jest.Mock).mockResolvedValue([mockHotel]);

        const res = await request(app).get("/hotels");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([mockHotel]);
    });

    test("GET /hotels/:id should return a single hotel", async () => {
        (HotelService.getHotelById as jest.Mock).mockResolvedValue(mockHotel);

        const res = await request(app).get("/hotels/1");
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockHotel);
    });

    test("POST /hotels should create a hotel", async () => {
        (HotelService.createHotel as jest.Mock).mockResolvedValue(mockHotel);

        const res = await request(app).post("/hotels").send({
            name: mockHotel.name,
            location: mockHotel.location,
            address: mockHotel.address,
            contactPhone: mockHotel.contactPhone,
            category: mockHotel.category,
            rating: mockHotel.rating,
            imageUrl: mockHotel.imageUrl,
        });

        expect(res.status).toBe(201);
        expect(res.body).toEqual(mockHotel);
    });

    test("PATCH /hotels/:id should update a hotel", async () => {
        (HotelService.getHotelById as jest.Mock).mockResolvedValue(mockHotel);
        (HotelService.updateHotel as jest.Mock).mockResolvedValue({ ...mockHotel, name: "Updated Hotel" });

        const res = await request(app).patch("/hotels/1").send({ name: "Updated Hotel" });
        expect(res.status).toBe(200);
        expect(res.body.name).toBe("Updated Hotel");
    });

    test("DELETE /hotels/:id should delete a hotel", async () => {
        (HotelService.getHotelById as jest.Mock).mockResolvedValue(mockHotel);
        (HotelService.deleteHotel as jest.Mock).mockResolvedValue(undefined);

        const res = await request(app).delete("/hotels/1");
        expect(res.status).toBe(204);
    });
});
