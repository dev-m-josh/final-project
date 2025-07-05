import * as HotelService from "../../components/hotel/hotel.service";
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

const mockHotel = {
    hotelId: 1,
    name: "Test Hotel",
    location: "Nairobi",
    address: "123 Street",
    contactPhone: "0712345678",
    category: "Luxury",
    rating: "5",
    imageUrl: "https://example.com/image.jpg",
    createdAt: new Date(),
    updatedAt: new Date(),
};

beforeEach(() => {
    jest.clearAllMocks();

    // .select().from() - for getAllHotels
    (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockResolvedValue([mockHotel]),
    });

    // .insert().values().returning() - for createHotel
    (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([mockHotel]),
        }),
    });

    // .update().set().where().returning() - for updateHotel
    (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValue([mockHotel]),
            }),
        }),
    });

    // .delete().where() - for deleteHotel
    (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockResolvedValue(undefined),
    });
});

describe("Hotel Service", () => {
    test("getAllHotels should return all hotels", async () => {
        const result = await HotelService.getAllHotels();
        expect(result).toEqual([mockHotel]);
    });

    test("getHotelById should return a single hotel", async () => {
        (db.select as jest.Mock).mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([mockHotel]),
            }),
        });

        const result = await HotelService.getHotelById(1);
        expect(result).toEqual(mockHotel);
    });

    test("getHotelById should return null if not found", async () => {
        (db.select as jest.Mock).mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([]),
            }),
        });

        const result = await HotelService.getHotelById(999);
        expect(result).toBeNull();
    });

    test("createHotel should insert and return hotel", async () => {
        const result = await HotelService.createHotel(mockHotel);
        expect(result).toEqual(mockHotel);
    });

    test("updateHotel should return updated hotel", async () => {
        const result = await HotelService.updateHotel(1, { name: "Updated" });
        expect(result).toEqual(mockHotel);
    });

    test("deleteHotel should call db.delete().where()", async () => {
        const whereSpy = jest.fn().mockResolvedValue(undefined);
        (db.delete as jest.Mock).mockReturnValueOnce({ where: whereSpy });

        await HotelService.deleteHotel(1);
        expect(whereSpy).toHaveBeenCalled();
    });

    test("getHotelsByLocation should return hotels by location", async () => {
        (db.select as jest.Mock).mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([mockHotel]),
            }),
        });

        const result = await HotelService.getHotelsByLocation("Nairobi");
        expect(result).toEqual(mockHotel);
    });
});
