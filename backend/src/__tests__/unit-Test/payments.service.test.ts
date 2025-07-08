import * as PaymentService from "../../components/payments/payment.service";
import { db } from "../../drizzle/db";
// import { PaymentsTable } from "../../drizzle/schema";
// import { eq } from "drizzle-orm";

// Mock db module
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

const mockPayment = {
    paymentId: 1,
    bookingId: 2,
    userId: 3,
    amount: "100.00",
    isPaid: true,
    paymentMethod: "Mpesa",
    transactionId: "TXN123",
    paymentDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
};

describe("Payment Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("getAllPayments should return all payments", async () => {
        (db.select as jest.Mock).mockReturnValueOnce({
            from: jest.fn().mockResolvedValue([mockPayment]),
        });

        const result = await PaymentService.getAllPayments();
        expect(result).toEqual([mockPayment]);
    });

    test("getPaymentById should return a payment", async () => {
        (db.select as jest.Mock).mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([mockPayment]),
            }),
        });

        const result = await PaymentService.getPaymentById(1);
        expect(result).toEqual(mockPayment);
    });

    test("getPaymentById should return null if not found", async () => {
        (db.select as jest.Mock).mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([]),
            }),
        });

        const result = await PaymentService.getPaymentById(999);
        expect(result).toBeNull();
    });

    test("createPayment should insert and return the new payment", async () => {
        (db.insert as jest.Mock).mockReturnValueOnce({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValue([mockPayment]),
            }),
        });

        // Exclude paymentId when creating a new payment
        const { paymentId, ...newPaymentData } = mockPayment;
        const result = await PaymentService.createPayment(newPaymentData);
        expect(result).toEqual(mockPayment);
    });

    test("updatePayment should update and return the payment", async () => {
        (db.update as jest.Mock).mockReturnValueOnce({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue([mockPayment]),
                }),
            }),
        });

        const result = await PaymentService.updatePayment(1, { amount: "200.00" });
        expect(result).toEqual(mockPayment);
    });

    test("updatePayment should return null if not found", async () => {
        (db.update as jest.Mock).mockReturnValueOnce({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue([]),
                }),
            }),
        });

        const result = await PaymentService.updatePayment(999, { amount: "999.99" });
        expect(result).toBeNull();
    });

    test("deletePayment should call db.delete().where()", async () => {
        const whereSpy = jest.fn().mockResolvedValue(undefined);
        (db.delete as jest.Mock).mockReturnValueOnce({ where: whereSpy });

        await PaymentService.deletePayment(1);
        expect(whereSpy).toHaveBeenCalled();
    });

    test("getPaymentsByUserId should return payment by userId", async () => {
        (db.select as jest.Mock).mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([mockPayment]),
            }),
        });

        const result = await PaymentService.getPaymentsByUserId(3);
        expect(result).toEqual(mockPayment);
    });

    test("getPaymentsByUserId should return null if not found", async () => {
        (db.select as jest.Mock).mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([]),
            }),
        });

        const result = await PaymentService.getPaymentsByUserId(99);
        expect(result).toBeNull();
    });
});
