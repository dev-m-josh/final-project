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

beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
});

describe("Payment Controller - Integration Tests", () => {
    const mockPayment = {
        paymentId: 1,
        userId: 1,
        amount: "100.00",
        paymentMethod: "Credit Card",
        paymentDate: new Date().toISOString(),
    };

    test("GET /payments - success", async () => {
        (PaymentService.getAllPayments as jest.Mock).mockResolvedValue([mockPayment]);
        const res = await request(app).get("/payments");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([mockPayment]);
    });

    test("GET /payments/:id - success", async () => {
        (PaymentService.getPaymentById as jest.Mock).mockResolvedValue(mockPayment);
        const res = await request(app).get("/payments/1");
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockPayment);
    });

    test("GET /payments/:id - invalid ID", async () => {
        const res = await request(app).get("/payments/abc");
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: "Invalid payment ID" });
    });

    test("GET /payments/:id - not found", async () => {
        (PaymentService.getPaymentById as jest.Mock).mockResolvedValue(null);
        const res = await request(app).get("/payments/999");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Payment not found" });
    });

    test("POST /payments - success", async () => {
        (PaymentService.createPayment as jest.Mock).mockResolvedValue(mockPayment);
        const res = await request(app).post("/payments").send(mockPayment);
        expect(res.status).toBe(201);
        expect(res.body).toEqual(mockPayment);
    });

    test("PUT /payments/:id - success", async () => {
        (PaymentService.getPaymentById as jest.Mock).mockResolvedValue(mockPayment);
        (PaymentService.updatePayment as jest.Mock).mockResolvedValue({ ...mockPayment, amount: "200.00" });
        const res = await request(app).put("/payments/1").send({ amount: "200.00" });
        expect(res.status).toBe(200);
        expect(res.body.amount).toBe("200.00");
    });

    test("PUT /payments/:id - not found", async () => {
        (PaymentService.getPaymentById as jest.Mock).mockResolvedValue(null);
        const res = await request(app).put("/payments/1").send({ amount: "200.00" });
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Payment not found" });
    });

    test("PUT /payments/:id - invalid ID", async () => {
        const res = await request(app).put("/payments/abc").send({ amount: "200.00" });
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: "Invalid payment ID" });
    });

    test("DELETE /payments/:id - success", async () => {
        (PaymentService.getPaymentById as jest.Mock).mockResolvedValue(mockPayment);
        const res = await request(app).delete("/payments/1");
        expect(res.status).toBe(204);
    });

    test("DELETE /payments/:id - not found", async () => {
        (PaymentService.getPaymentById as jest.Mock).mockResolvedValue(null);
        const res = await request(app).delete("/payments/1");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Payment not found" });
    });

    test("DELETE /payments/:id - invalid ID", async () => {
        const res = await request(app).delete("/payments/abc");
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: "Invalid payment ID" });
    });

    test("GET /payments/user/:userId - success", async () => {
        (PaymentService.getPaymentsByUserId as jest.Mock).mockResolvedValue([mockPayment]);
        const res = await request(app).get("/payments/user/1");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([mockPayment]);
    });

    // Error paths
    test("GET /payments - should handle error", async () => {
        (PaymentService.getAllPayments as jest.Mock).mockRejectedValue(new Error("DB error"));
        const res = await request(app).get("/payments");
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to fetch payments" });
    });

    test("POST /payments - should handle error", async () => {
        (PaymentService.createPayment as jest.Mock).mockRejectedValue(new Error("DB error"));
        const res = await request(app).post("/payments").send(mockPayment);
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to create payment" });
    });

    test("GET /payments/:id - should handle error", async () => {
        (PaymentService.getPaymentById as jest.Mock).mockRejectedValue(new Error("DB error"));
        const res = await request(app).get("/payments/1");
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to fetch payment" });
    });

    test("PUT /payments/:id - should handle error", async () => {
        (PaymentService.getPaymentById as jest.Mock).mockResolvedValue(mockPayment);
        (PaymentService.updatePayment as jest.Mock).mockRejectedValue(new Error("DB error"));
        const res = await request(app).put("/payments/1").send({ amount: "200.00" });
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to update payment" });
    });

    test("DELETE /payments/:id - should handle error", async () => {
        (PaymentService.getPaymentById as jest.Mock).mockResolvedValue(mockPayment);
        (PaymentService.deletePayment as jest.Mock).mockRejectedValue(new Error("DB error"));
        const res = await request(app).delete("/payments/1");
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to delete payment" });
    });

    test("GET /payments/user/:userId - should handle error", async () => {
        (PaymentService.getPaymentsByUserId as jest.Mock).mockRejectedValue(new Error("DB error"));
        const res = await request(app).get("/payments/user/1");
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to fetch payments by user" });
    });
});
