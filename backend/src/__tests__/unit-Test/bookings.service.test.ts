// Import the BookingService methods to be tested
import * as BookingService from "../../components/bookings/booking.service";

// Import the real DB (but we'll mock it below)
import { db } from "../../drizzle/db";

// MOCK the database methods to isolate service logic
jest.mock("../../drizzle/db", () => ({
    db: {
        select: jest.fn(),
        insert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));

// Suppress log/error output during tests to keep output clean
beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
});

// A fake booking used for return values in tests
const mockBooking = {
    bookingId: 1,
    userId: 2,
    roomId: 3,
    checkInDate: new Date(),
    checkOutDate: new Date(),
    numberOfGuests: 2,
    isConfirmed: true,
    createdAt: new Date(),
    updatedAt: new Date(),
};

// 📦 Main test suite
describe("Booking Service", () => {
    // Clear mocks before each test for isolation
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("getAllBookings should return all bookings", async () => {
        // Mock db.select().from() to return an array with mockBooking
        (db.select as jest.Mock).mockReturnValueOnce({
            from: jest.fn().mockResolvedValue([mockBooking]),
        });

        const result = await BookingService.getAllBookings();
        expect(result).toEqual([mockBooking]);
    });

    test("getBookingById should return a booking", async () => {
        (db.select as jest.Mock).mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([mockBooking]),
            }),
        });

        const result = await BookingService.getBookingById(1);
        expect(result).toEqual(mockBooking);
    });

    test("getBookingById should return null if not found", async () => {
        (db.select as jest.Mock).mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([]), // empty result
            }),
        });

        const result = await BookingService.getBookingById(999);
        expect(result).toBeNull(); // Not found case
    });

    test("createBooking should insert and return the booking", async () => {
        // Mock the insert → values → returning chain
        (db.insert as jest.Mock).mockReturnValueOnce({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValue([mockBooking]),
            }),
        });

        // Exclude bookingId, simulate form input
        const { bookingId, ...bookingData } = mockBooking;

        // Convert dates to ISO strings to simulate request payload
        const bookingDataWithStrings = {
            ...bookingData,
            checkInDate: bookingData.checkInDate.toISOString(),
            checkOutDate: bookingData.checkOutDate.toISOString(),
        };

        const result = await BookingService.createBooking(bookingDataWithStrings);
        expect(result).toEqual(mockBooking);
    });

    test("updateBooking should return updated booking", async () => {
        // Mock the update → set → where → returning chain
        (db.update as jest.Mock).mockReturnValueOnce({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue([mockBooking]),
                }),
            }),
        });

        const result = await BookingService.updateBooking(1, { isConfirmed: false });
        expect(result).toEqual(mockBooking);
    });

    test("updateBooking should return null if not found", async () => {
        (db.update as jest.Mock).mockReturnValueOnce({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue([]), // Not found
                }),
            }),
        });

        const result = await BookingService.updateBooking(999, { isConfirmed: true });
        expect(result).toBeNull();
    });

    test("deleteBooking should call db.delete().where()", async () => {
        // Just verify it calls db.delete().where() — no return expected
        const whereSpy = jest.fn().mockResolvedValue(undefined);
        (db.delete as jest.Mock).mockReturnValueOnce({ where: whereSpy });

        await BookingService.deleteBooking(1);
        expect(whereSpy).toHaveBeenCalled();
    });

    test("getBookingsByUserId should return user bookings", async () => {
        (db.select as jest.Mock).mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([mockBooking]),
            }),
        });

        const result = await BookingService.getBookingsByUserId(2);
        expect(result).toEqual([mockBooking]);
    });

    test("getBookingsByStatus should return bookings by status", async () => {
        (db.select as jest.Mock).mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([mockBooking]),
            }),
        });

        const result = await BookingService.getBookingsByStatus(true);
        expect(result).toEqual([mockBooking]);
    });
});
