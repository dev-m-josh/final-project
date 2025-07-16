import * as AuthService from "../../components/auth/auth.service";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Import email function to mock sending welcome emails
import { sendWelcomeEmail } from "../../middleware/mailer";

// Mock all external dependencies to isolate and test only AuthService logic
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../../middleware/mailer");

// Suppress console.log and console.error during tests to keep output clean
beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
});

// Create mock functions for database operations
const mockInsert = jest.fn();
const mockSelect = jest.fn();
const mockUpdate = jest.fn();

// Mock the database module used in AuthService
jest.mock("../../drizzle/db", () => ({
    db: {
        insert: jest.fn(() => ({
            values: jest.fn(() => ({
                returning: mockInsert, // For insert queries
            })),
        })),
        select: jest.fn(() => ({
            from: jest.fn(() => ({
                where: mockSelect, // For select queries
            })),
        })),
        update: jest.fn(() => ({
            set: jest.fn(() => ({
                where: mockUpdate, // For update queries
            })),
        })),
    },
}));

// Define the test suite for the AuthService module
describe("AuthService", () => {
    // Sample fake user used in multiple test cases
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

    // Reset mocks before each test to ensure isolation
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("registerUser", () => {
        it("should register user and return token", async () => {
            // Simulate hashing the password
            (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

            // Simulate generating JWT
            (jwt.sign as jest.Mock).mockReturnValue("fake-token");

            // Simulate successful DB insert returning user data
            mockInsert.mockResolvedValue([fakeUser]);

            // Call the function
            const result = await AuthService.registerUser({
                firstname: "Test",
                address: "123 Main St",
                lastname: "User",
                email: "test@example.com",
                password: "password123",
                contactPhone: "1234567890",
            });

            // Assertions
            expect(bcrypt.hash).toHaveBeenCalled(); // Should hash password
            expect(sendWelcomeEmail).toHaveBeenCalledWith("test@example.com", "Test", expect.any(String)); // Email sent
            expect(result.user).toEqual(fakeUser); // User is returned
            expect(result.token).toBe("fake-token"); // Token is returned
        });
    });

    describe("loginUser", () => {
        it("should return user and token if valid credentials", async () => {
            // Simulate user found in DB
            mockSelect.mockResolvedValue([fakeUser]);

            // Simulate password match
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            // Simulate JWT token
            (jwt.sign as jest.Mock).mockReturnValue("fake-token");

            const result = await AuthService.loginUser("test@example.com", "password123");

            // Expected: valid user + token
            expect(result.user).toEqual(fakeUser);
            expect(result.token).toBe("fake-token");
        });

        it("should throw error if user not found", async () => {
            // Simulate no user found
            mockSelect.mockResolvedValue([]);

            await expect(AuthService.loginUser("wrong@example.com", "pass")).rejects.toThrow(
                "Invalid email or password"
            );
        });

        it("should throw error if password is incorrect", async () => {
            // Simulate user found
            mockSelect.mockResolvedValue([fakeUser]);

            // Simulate wrong password
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(AuthService.loginUser("test@example.com", "wrongpass")).rejects.toThrow(
                "Invalid email or password"
            );
        });
    });

    describe("verifyUser", () => {
        it("should verify user if code matches", async () => {
            // Simulate matching user with correct code
            mockSelect.mockResolvedValue([fakeUser]);

            const result = await AuthService.verifyUser("test@example.com", "ABC123");
            expect(result.message).toBe("Account verified successfully");
        });

        it("should throw error if user not found", async () => {
            mockSelect.mockResolvedValue([]);

            await expect(AuthService.verifyUser("notfound@example.com", "123")).rejects.toThrow("User not found");
        });

        it("should throw if user already verified", async () => {
            // Simulate user already verified
            mockSelect.mockResolvedValue([{ ...fakeUser, isVerified: true }]);

            await expect(AuthService.verifyUser("test@example.com", "ABC123")).rejects.toThrow("User already verified");
        });

        it("should throw if verification code is wrong", async () => {
            // Simulate incorrect verification code
            mockSelect.mockResolvedValue([{ ...fakeUser, verificationCode: "WRONG" }]);

            await expect(AuthService.verifyUser("test@example.com", "ABC123")).rejects.toThrow(
                "Invalid verification code"
            );
        });
    });
});
