import request from "supertest";
import express from "express";
import * as authController from "../../components/auth/auth.controller";
import * as AuthService from "../../components/auth/auth.service";

const app = express();
app.use(express.json());
app.post("/auth/register", authController.register);
app.post("/auth/login", authController.login as unknown as express.RequestHandler);
app.post("/auth/verify", authController.verify);

// Mock the AuthService
jest.mock("../../components/auth/auth.service");

beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
});

jest.spyOn(console, "error").mockImplementation(() => {});

describe("Auth Controller - Integration Tests", () => {
    const mockUser = {
        customerID: 1,
        email: "muambukijoshua2@gmail.com",
        firstname: "Joshua",
        lastname: "Mutambuki",
        password: "$2a$10$hashedpassword",
        address: "123 Main St",
        isAdmin: false,
        verificationCode: "ABC123",
        isVerified: false,
    };

    const mockToken = "mock.jwt.token";

    test("POST /auth/register should register a user and return token", async () => {
        (AuthService.registerUser as jest.Mock).mockResolvedValue({
            user: { ...mockUser, verificationCode: "ABC123" },
            token: mockToken,
        });

        const response = await request(app).post("/auth/register").send({
            email: mockUser.email,
            firstname: mockUser.firstname,
            lastname: mockUser.lastname,
            password: "12345678",
            address: mockUser.address,
        });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            message: "Registration successful",
            user: expect.objectContaining({ email: mockUser.email }),
            token: mockToken,
            verificationCode: "ABC123",
        });
    });

    test("POST /auth/login should return a token", async () => {
        (AuthService.loginUser as jest.Mock).mockResolvedValue({
            user: mockUser,
            token: mockToken,
        });

        const response = await request(app).post("/auth/login").send({
            email: mockUser.email,
            password: "12345678",
        });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "Login successful",
            user: expect.objectContaining({ email: mockUser.email }),
            token: mockToken,
        });
    });

    test("POST /auth/verify should verify a user account", async () => {
        (AuthService.verifyUser as jest.Mock).mockResolvedValue({
            message: "Account verified successfully",
        });

        const response = await request(app).post("/auth/verify").send({
            email: mockUser.email,
            code: mockUser.verificationCode,
        });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "Account verified successfully",
        });
    });

    test("POST /auth/login should return 400 if email or password is missing", async () => {
        // Missing email
        let response = await request(app).post("/auth/login").send({ password: "12345678" });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Email and password are required" });

        // Missing password
        response = await request(app).post("/auth/login").send({ email: "test@example.com" });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Email and password are required" });

        // Missing both
        response = await request(app).post("/auth/login").send({});
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Email and password are required" });
    });

    test("POST /auth/login should return 401 if an error occurs", async () => {
        (AuthService.loginUser as jest.Mock).mockRejectedValue(new Error("Failed to login user"));

        const response = await request(app).post("/auth/login").send({
            email: mockUser.email,
            password: "12345678",
        });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ error: "Failed to login user" });
    });

    test("POST /auth/register should return 500 if an error occurs", async () => {
        (AuthService.registerUser as jest.Mock).mockRejectedValue(new Error("Failed to register user"));

        const response = await request(app).post("/auth/register").send({
            email: mockUser.email,
            firstname: mockUser.firstname,
            password: "12345678",
        });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Failed to register user" });
    });

    test("POST /auth/verify should return 401 if an error occurs", async () => {
        (AuthService.verifyUser as jest.Mock).mockRejectedValue(new Error("Failed to verify user"));

        const response = await request(app).post("/auth/verify").send({
            email: mockUser.email,
            code: mockUser.verificationCode,
        });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ error: "Failed to verify user" });
    });
});
