import request from "supertest";
import express from "express";
import {
    getAllPayments,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment,
    getPaymentsByUserId,
} from "../../components/payments/payment.controller";
import * as PaymentService from "../../components/payments/payment.service";

const app = express();
app.use(express.json());
app.get("/payments", getAllPayments as any);
app.get("/payments/:id", getPaymentById as any);
app.get("/payments/user/:userId", getPaymentsByUserId as any);
app.post("/payments", createPayment as any);
app.put("/payments/:id", updatePayment as any);
app.delete("/payments/:id", deletePayment as any);

jest.mock("../../components/payments/payment.service");

describe("Payments Controller - Integration Tests", () => {
    const mockPayment = {
        paymentId: 1,
        bookingId: 1,
        userId: 1,
        amount: "100.00",
        isPaid: true,
        paymentMethod: "Credit Card",
        transactionId: "txn_123456",
        paymentDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("GET /payments should return all payments", async () => {
        (PaymentService.getAllPayments as jest.Mock).mockResolvedValue([mockPayment]);
        const res = await request(app).get("/payments");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([mockPayment]);
    });

    test("GET /payments/:id should return a payment", async () => {
        (PaymentService.getPaymentById as jest.Mock).mockResolvedValue(mockPayment);
        const res = await request(app).get("/payments/1");
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockPayment);
    });

    test("GET /payments/:id should return 400 for invalid ID", async () => {
        const res = await request(app).get("/payments/invalid");
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: "Invalid payment ID" });
    });

    test("GET /payments/:id should return 404 if not found", async () => {
        (PaymentService.getPaymentById as jest.Mock).mockResolvedValue(null);
        const res = await request(app).get("/payments/99");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Payment not found" });
    });

    test("POST /payments should create a payment", async () => {
        (PaymentService.createPayment as jest.Mock).mockResolvedValue(mockPayment);
        const res = await request(app).post("/payments").send(mockPayment);
        expect(res.status).toBe(201);
        expect(res.body).toEqual(mockPayment);
    });

    test("PUT /payments/:id should update a payment", async () => {
        (PaymentService.getPaymentById as jest.Mock).mockResolvedValue(mockPayment);
        (PaymentService.updatePayment as jest.Mock).mockResolvedValue({ ...mockPayment, isPaid: false });
        const res = await request(app).put("/payments/1").send({ isPaid: false });
        expect(res.status).toBe(200);
        expect(res.body.isPaid).toBe(false);
    });

    test("PUT /payments/:id should return 404 if not found", async () => {
        (PaymentService.getPaymentById as jest.Mock).mockResolvedValue(null);
        const res = await request(app).put("/payments/1").send({ isPaid: false });
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Payment not found" });
    });

    test("DELETE /payments/:id should delete payment", async () => {
        (PaymentService.getPaymentById as jest.Mock).mockResolvedValue(mockPayment);
        const res = await request(app).delete("/payments/1");
        expect(res.status).toBe(204);
    });

    test("DELETE /payments/:id should return 404 if not found", async () => {
        (PaymentService.getPaymentById as jest.Mock).mockResolvedValue(null);
        const res = await request(app).delete("/payments/1");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Payment not found" });
    });

    test("GET /payments/user/:userId should return payments by user", async () => {
        (PaymentService.getPaymentsByUserId as jest.Mock).mockResolvedValue([mockPayment]);
        const res = await request(app).get("/payments/user/1");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([mockPayment]);
    });

    test("GET /payments should return 500 on error", async () => {
        (PaymentService.getAllPayments as jest.Mock).mockRejectedValue(new Error("DB error"));
        const res = await request(app).get("/payments");
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to fetch payments" });
    });
});
