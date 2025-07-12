// ✅ Import Supertest to simulate HTTP requests for integration testing
import request from "supertest";// Import Express to create a test server
import express from "express";

// Import controller handlers for register, login, and verify
import * as authController from "../../components/auth/auth.controller";

// Import the AuthService module (to be mocked)
import * as AuthService from "../../components/auth/auth.service";

// Set up a minimal Express app and register routes for testing
const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// Map endpoints to controller functions
app.post("/auth/register", authController.register);
app.post("/auth/login", authController.login as unknown as express.RequestHandler); // Forced type match for TS
app.post("/auth/verify", authController.verify);

// Mock AuthService so we can isolate controller behavior
jest.mock("../../components/auth/auth.service");

// Silence logs to avoid noise during test runs
beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
});

// Test suite for auth controller integration with service layer mocked
describe("Auth Controller - Integration Tests", () => {
    // 🔧 A fake user object that represents a typical registered user
    const mockUser = {
        customerID: 1,
        email: "muambukijoshua2@gmail.com",
        firstname: "Joshua",
        lastname: "Mutambuki",
        password: "$2a$10$hashedpassword", // hashed password
        address: "123 Main St",
        isAdmin: false,
        verificationCode: "ABC123",
        isVerified: false,
    };

    // A mock JWT token used for register/login tests
    const mockToken = "mock.jwt.token";

    test("POST /auth/register should register a user and return token", async () => {
        // Simulate successful user registration and token generation
        (AuthService.registerUser as jest.Mock).mockResolvedValue({
            user: { ...mockUser, verificationCode: "ABC123" },
            token: mockToken,
        });

        // Send a POST request to the register endpoint
        const response = await request(app).post("/auth/register").send({
            email: mockUser.email,
            firstname: mockUser.firstname,
            lastname: mockUser.lastname,
            password: "12345678",
            address: mockUser.address,
        });

        // Validate HTTP response
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            message: "Registration successful",
            user: expect.objectContaining({ email: mockUser.email }),
            token: mockToken,
            verificationCode: "ABC123",
        });
    });

    test("POST /auth/login should return a token", async () => {
        // Mock the AuthService to simulate valid login
        (AuthService.loginUser as jest.Mock).mockResolvedValue({
            user: mockUser,
            token: mockToken,
        });

        // Send login request
        const response = await request(app).post("/auth/login").send({
            email: mockUser.email,
            password: "12345678",
        });

        // Check login response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "Login successful",
            user: expect.objectContaining({ email: mockUser.email }),
            token: mockToken,
        });
    });

    test("POST /auth/verify should verify a user account", async () => {
        // Mock successful verification
        (AuthService.verifyUser as jest.Mock).mockResolvedValue({
            message: "Account verified successfully",
        });

        // Send verification request
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
        // Test: missing email
        let response = await request(app).post("/auth/login").send({ password: "12345678" });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Email and password are required" });

        // Test: missing password
        response = await request(app).post("/auth/login").send({ email: "test@example.com" });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Email and password are required" });

        // Test: both missing
        response = await request(app).post("/auth/login").send({});
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Email and password are required" });
    });

    test("POST /auth/login should return 401 if an error occurs", async () => {
        // Simulate failure inside AuthService.loginUser
        (AuthService.loginUser as jest.Mock).mockRejectedValue(new Error("Failed to login user"));

        const response = await request(app).post("/auth/login").send({
            email: mockUser.email,
            password: "12345678",
        });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ error: "Failed to login user" });
    });

    test("POST /auth/register should return 500 if an error occurs", async () => {
        // Simulate failure in registerUser
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
        // Simulate failure in verifyUser
        (AuthService.verifyUser as jest.Mock).mockRejectedValue(new Error("Failed to verify user"));

        const response = await request(app).post("/auth/verify").send({
            email: mockUser.email,
            code: mockUser.verificationCode,
        });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ error: "Failed to verify user" });
    });
});
