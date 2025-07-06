import * as AuthService from "../../components/auth/auth.service";
// import { db } from "../../drizzle/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../../middleware/mailer";

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../../middleware/mailer");

beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
});

const mockInsert = jest.fn();
const mockSelect = jest.fn();
const mockUpdate = jest.fn();

jest.mock("../../drizzle/db", () => ({
    db: {
        insert: jest.fn(() => ({
            values: jest.fn(() => ({
                returning: mockInsert,
            })),
        })),
        select: jest.fn(() => ({
            from: jest.fn(() => ({
                where: mockSelect,
            })),
        })),
        update: jest.fn(() => ({
            set: jest.fn(() => ({
                where: mockUpdate,
            })),
        })),
    },
}));

describe("AuthService", () => {
    const fakeUser = {
        customerID: 1,
        email: "test@example.com",
        firstname: "Test",
        lastname: "User",
        address: "123 Main St",
        password: "hashedPassword",
        isAdmin: false,
        verificationCode: "ABC123",
        isVerified: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("registerUser", () => {
        it("should register user and return token", async () => {
            (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
            (jwt.sign as jest.Mock).mockReturnValue("fake-token");
            mockInsert.mockResolvedValue([fakeUser]);

            const result = await AuthService.registerUser({
                firstname: "Test",
                address: "123 Main St",
                lastname: "User",
                email: "test@example.com",
                password: "password123",
                contactPhone: "1234567890",
            });

            expect(bcrypt.hash).toHaveBeenCalled();
            expect(sendWelcomeEmail).toHaveBeenCalledWith("test@example.com", "Test", expect.any(String));
            expect(result.user).toEqual(fakeUser);
            expect(result.token).toBe("fake-token");
        });
    });

    describe("loginUser", () => {
        it("should return user and token if valid credentials", async () => {
            mockSelect.mockResolvedValue([fakeUser]);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue("fake-token");

            const result = await AuthService.loginUser("test@example.com", "password123");
            expect(result.user).toEqual(fakeUser);
            expect(result.token).toBe("fake-token");
        });

        it("should throw error if user not found", async () => {
            mockSelect.mockResolvedValue([]);
            await expect(AuthService.loginUser("wrong@example.com", "pass")).rejects.toThrow(
                "Invalid email or password"
            );
        });

        it("should throw error if password is incorrect", async () => {
            mockSelect.mockResolvedValue([fakeUser]);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(AuthService.loginUser("test@example.com", "wrongpass")).rejects.toThrow(
                "Invalid email or password"
            );
        });
    });

    describe("verifyUser", () => {
        it("should verify user if code matches", async () => {
            mockSelect.mockResolvedValue([fakeUser]);

            const result = await AuthService.verifyUser("test@example.com", "ABC123");
            expect(result.message).toBe("Account verified successfully");
        });

        it("should throw error if user not found", async () => {
            mockSelect.mockResolvedValue([]);
            await expect(AuthService.verifyUser("notfound@example.com", "123")).rejects.toThrow("User not found");
        });

        it("should throw if user already verified", async () => {
            mockSelect.mockResolvedValue([{ ...fakeUser, isVerified: true }]);
            await expect(AuthService.verifyUser("test@example.com", "ABC123")).rejects.toThrow("User already verified");
        });

        it("should throw if verification code is wrong", async () => {
            mockSelect.mockResolvedValue([{ ...fakeUser, verificationCode: "WRONG" }]);
            await expect(AuthService.verifyUser("test@example.com", "ABC123")).rejects.toThrow(
                "Invalid verification code"
            );
        });
    });
});
