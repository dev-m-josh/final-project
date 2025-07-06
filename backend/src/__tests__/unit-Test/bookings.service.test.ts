import * as BookingService from "../../components/bookings/booking.service";
import { db } from "../../drizzle/db";
import { BookingsTable } from "../../drizzle/schema";

// Mock the db module
jest.mock("../../drizzle/db", () => ({
    db: {
        select: jest.fn(),
        insert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));

beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
});

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

describe("Booking Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("getAllBookings should return all bookings", async () => {
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
                where: jest.fn().mockResolvedValue([]),
            }),
        });

        const result = await BookingService.getBookingById(999);
        expect(result).toBeNull();
    });

    test("createBooking should insert and return the booking", async () => {
        (db.insert as jest.Mock).mockReturnValueOnce({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValue([mockBooking]),
            }),
        });

        // Remove bookingId since it's omitted in the createBooking input type
        const { bookingId, ...bookingData } = mockBooking;
        const bookingDataWithStrings = {
            ...bookingData,
            checkInDate: bookingData.checkInDate.toISOString(),
            checkOutDate: bookingData.checkOutDate.toISOString(),
        };
        const result = await BookingService.createBooking(bookingDataWithStrings);
        expect(result).toEqual(mockBooking);
    });

    test("updateBooking should return updated booking", async () => {
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
                    returning: jest.fn().mockResolvedValue([]),
                }),
            }),
        });

        const result = await BookingService.updateBooking(999, { isConfirmed: true });
        expect(result).toBeNull();
    });

    test("deleteBooking should call db.delete().where()", async () => {
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
