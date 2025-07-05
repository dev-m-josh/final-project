import request from "supertest";
import express from "express";
import { getAllUsers, getUserById, deleteUser, updateUser } from "../../components/user/user.controller";
import * as UserService from "../../components/user/user.service";

const app = express();
app.use(express.json());

app.get("/users", getAllUsers as any);
app.get("/users/:id", getUserById as any);
app.delete("/users/:id", deleteUser as any);
app.put("/users/:id", updateUser as any);

jest.mock("../../components/user/user.service");

describe("User Controller - Integration Tests", () => {
    const mockUser = {
        userId: 1,
        firstname: "Jane",
        lastname: "Doe",
        email: "jane@example.com",
        password: "hashedpass",
        address: "123 Street",
        contactPhone: "0712345678",
        isAdmin: false,
        isVerified: true,
        verificationCode: "ABC123",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("GET /users should return all users", async () => {
        (UserService.getAllUsers as jest.Mock).mockResolvedValue([mockUser]);

        const res = await request(app).get("/users");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([mockUser]);
    });

    test("GET /users/:id should return a user", async () => {
        (UserService.getUserById as jest.Mock).mockResolvedValue(mockUser);

        const res = await request(app).get("/users/1");
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockUser);
    });

    test("GET /users/:id should return 404 if user not found", async () => {
        (UserService.getUserById as jest.Mock).mockResolvedValue(null);

        const res = await request(app).get("/users/999");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "User not found" });
    });

    test("DELETE /users/:id should delete user", async () => {
        (UserService.getUserById as jest.Mock).mockResolvedValue(mockUser);
        (UserService.deleteUser as jest.Mock).mockResolvedValue(undefined);

        const res = await request(app).delete("/users/1");
        expect(res.status).toBe(204);
    });

    test("DELETE /users/:id should return 404 if user not found", async () => {
        (UserService.getUserById as jest.Mock).mockResolvedValue(null);

        const res = await request(app).delete("/users/999");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "User not found" });
    });

    test("PUT /users/:id should update and return user", async () => {
        (UserService.getUserById as jest.Mock).mockResolvedValue(mockUser);
        (UserService.updateUser as jest.Mock).mockResolvedValue({
            ...mockUser,
            firstname: "Updated",
        });

        const res = await request(app).put("/users/1").send({
            firstname: "Updated",
        });

        expect(res.status).toBe(200);
        expect(res.body.firstname).toBe("Updated");
    });

    test("PUT /users/:id should return 404 if user not found", async () => {
        (UserService.getUserById as jest.Mock).mockResolvedValue(null);

        const res = await request(app).put("/users/999").send({
            firstname: "Someone",
        });

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "User not found" });
    });

    test("GET /users should return 500 if service throws error", async () => {
        (UserService.getAllUsers as jest.Mock).mockRejectedValue(new Error("DB error"));

        const res = await request(app).get("/users");
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to fetch users" });
    });
});
