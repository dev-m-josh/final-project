import * as UserService from "../../components/user/user.service";
import { db } from "../../drizzle/db";

jest.mock("../../drizzle/db", () => ({
    db: {
        select: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
    },
}));

beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
});

const mockUser = {
    userId: 1,
    firstname: "Jane",
    lastname: "Doe",
    email: "jane@example.com",
    password: "hashedpass",
    contactPhone: "0712345678",
    address: "123 Street",
    isAdmin: false,
    verificationCode: "ABC123",
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

describe("User Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("getAllUsers should return all users", async () => {
        (db.select as jest.Mock).mockReturnValueOnce({
            from: jest.fn().mockResolvedValue([mockUser]),
        });

        const result = await UserService.getAllUsers();
        expect(result).toEqual([mockUser]);
    });

    test("getUserById should return a single user", async () => {
        (db.select as jest.Mock).mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([mockUser]),
            }),
        });

        const result = await UserService.getUserById(1);
        expect(result).toEqual(mockUser);
    });

    test("getUserById should return null if user not found", async () => {
        (db.select as jest.Mock).mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([]),
            }),
        });

        const result = await UserService.getUserById(99);
        expect(result).toBeNull();
    });

    test("deleteUser should call db.delete().where()", async () => {
        const whereSpy = jest.fn().mockResolvedValue(undefined);
        (db.delete as jest.Mock).mockReturnValueOnce({ where: whereSpy });

        await UserService.deleteUser(1);
        expect(whereSpy).toHaveBeenCalled();
    });

    test("updateUser should return updated user", async () => {
        (db.update as jest.Mock).mockReturnValueOnce({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue([mockUser]),
                }),
            }),
        });

        const result = await UserService.updateUser(1, { firstname: "Updated" });
        expect(result).toEqual(mockUser);
    });

    test("updateUser should return null if no user updated", async () => {
        (db.update as jest.Mock).mockReturnValueOnce({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue([]),
                }),
            }),
        });

        const result = await UserService.updateUser(1, { firstname: "Updated" });
        expect(result).toBeNull();
    });
});
