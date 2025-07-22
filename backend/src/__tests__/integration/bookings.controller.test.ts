import request from "supertest";
import express from "express";
import * as BookingController from "../../components/bookings/booking.controller";
import * as BookingService from "../../components/bookings/booking.service";

const app = express();
app.use(express.json());

app.get("/bookings", BookingController.getAllBookings as any);
app.get("/bookings/:id", BookingController.getBookingById as any);
app.post("/bookings", BookingController.createBooking as any);
app.put("/bookings/:id", BookingController.updateBooking as any);
app.delete("/bookings/:id", BookingController.deleteBooking as any);
app.get("/bookings/user/:id", BookingController.getBookingsByUserId as any);
app.get("/bookings/status/:status", BookingController.getBookingsByStatus as any);

jest.mock("../../components/bookings/booking.service");

beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
});

const mockBooking = {
    bookingId: 1,
    userId: 2,
    roomId: 3,
    checkInDate: new Date().toISOString(),
    checkOutDate: new Date().toISOString(),
    numberOfGuests: 2,
    isConfirmed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

describe("Booking Controller - Integration Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("GET /bookings should return all bookings", async () => {
        (BookingService.getAllBookings as jest.Mock).mockResolvedValue([mockBooking]);

        const res = await request(app).get("/bookings");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([mockBooking]);
    });

    test("GET /bookings/:id should return one booking", async () => {
        (BookingService.getBookingById as jest.Mock).mockResolvedValue(mockBooking);

        const res = await request(app).get("/bookings/1");
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockBooking);
    });

    test("GET /bookings/:id should return 404 if not found", async () => {
        (BookingService.getBookingById as jest.Mock).mockResolvedValue(null);

        const res = await request(app).get("/bookings/999");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Booking not found" });
    });

    test("POST /bookings should create a booking", async () => {
        (BookingService.createBooking as jest.Mock).mockResolvedValue(mockBooking);

        const res = await request(app).post("/bookings").send(mockBooking);
        expect(res.status).toBe(201);
        expect(res.body).toEqual(mockBooking);
    });

    test("PUT /bookings/:id should update a booking", async () => {
        (BookingService.getBookingById as jest.Mock).mockResolvedValue(mockBooking);
        (BookingService.updateBooking as jest.Mock).mockResolvedValue({ ...mockBooking, numberOfGuests: 4 });

        const res = await request(app).put("/bookings/1").send({ numberOfGuests: 4 });
        expect(res.status).toBe(200);
        expect(res.body.numberOfGuests).toBe(4);
    });

    test("PUT /bookings/:id should return 404 if not found", async () => {
        (BookingService.getBookingById as jest.Mock).mockResolvedValue(null);

        const res = await request(app).put("/bookings/1").send({ numberOfGuests: 4 });
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Booking not found" });
    });

    test("DELETE /bookings/:id should delete booking", async () => {
        (BookingService.getBookingById as jest.Mock).mockResolvedValue(mockBooking);
        (BookingService.deleteBooking as jest.Mock).mockResolvedValue(undefined);

        const res = await request(app).delete("/bookings/1");
        expect(res.status).toBe(204);
    });

    test("DELETE /bookings/:id should return 404 if not found", async () => {
        (BookingService.getBookingById as jest.Mock).mockResolvedValue(null);

        const res = await request(app).delete("/bookings/999");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Booking not found" });
    });

    // test("GET /bookings/user/:id should return bookings for user", async () => {
    //     (BookingService.getBookingsByUserId as jest.Mock).mockResolvedValue([mockBooking]);

    //     const res = await request(app).get("/bookings/user/2");
    //     expect(res.status).toBe(200);
    //     expect(res.body).toEqual([mockBooking]);
    // });

    test("GET /bookings/user/:id should return 400 for invalid user ID", async () => {
        const res = await request(app).get("/bookings/user/invalid");
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: "User has no bookings yet!" });
    });

    test("GET /bookings/status/confirmed should return confirmed bookings", async () => {
        (BookingService.getBookingsByStatus as jest.Mock).mockResolvedValue([mockBooking]);

        const res = await request(app).get("/bookings/status/confirmed");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([mockBooking]);
    });

    test("GET /bookings/status/pending should return pending bookings", async () => {
        (BookingService.getBookingsByStatus as jest.Mock).mockResolvedValue([mockBooking]);

        const res = await request(app).get("/bookings/status/pending");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([mockBooking]);
    });

    test("GET /bookings/status/unknown should return 400", async () => {
        const res = await request(app).get("/bookings/status/unknown");
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: "Invalid status" });
    });

    test("GET /bookings should return 500 on error", async () => {
        (BookingService.getAllBookings as jest.Mock).mockRejectedValue(new Error("DB error"));

        const res = await request(app).get("/bookings");
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to fetch bookings" });
    });

    test("GET /bookings should return 500 on error", async () => {
        (BookingService.getBookingById as jest.Mock).mockRejectedValue(new Error("DB error"));

        const res = await request(app).get("/bookings/unknown");
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to fetch booking" });
    });

    test("POST /bookings should return 500 on error", async () => {
        (BookingService.createBooking as jest.Mock).mockRejectedValue(new Error("DB error"));

        const res = await request(app).post("/bookings");
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to create booking" });
    });

    test("PUT /bookings should return 500 on error", async () => {
        (BookingService.updateBooking as jest.Mock).mockRejectedValue(new Error("DB error"));

        const res = await request(app).put("/bookings/unknown");
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to update booking" });
    });

    test("DELETE /bookings should return 500 on error", async () => {
        (BookingService.getAllBookings as jest.Mock).mockRejectedValue(new Error("DB error"));

        const res = await request(app).delete("/bookings/unknown");
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to delete booking" });
    });
});
