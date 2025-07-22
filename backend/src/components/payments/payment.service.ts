// src/services/payments.service.ts
import { eq } from "drizzle-orm";
import { db } from "../../drizzle/db";
import { PaymentsTable } from "../../drizzle/schema";

export const getAllPayments = async () => {
    return await db.select().from(PaymentsTable);
};

export const getPaymentById = async (id: number) => {
    const result = await db.select().from(PaymentsTable).where(eq(PaymentsTable.paymentId, id));
    return result[0] || null;
};

export const createPayment = async (rawPayment: any) => {
    const {
        bookingId,
        userId,
        amount,
        isPaid,
        paymentMethod,
        transactionId,
        paymentDate,
    } = rawPayment;

    const paymentData = {
        bookingId,
        userId,
        amount,
        isPaid,
        paymentMethod,
        transactionId,
        paymentDate: new Date(paymentDate),
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const result = await db.insert(PaymentsTable).values(paymentData).returning();
    return result[0];
};

export const updatePayment = async (id: number, data: Partial<typeof PaymentsTable.$inferInsert>) => {
    const result = await db.update(PaymentsTable).set(data).where(eq(PaymentsTable.paymentId, id)).returning();
    return result[0] || null;
};

export const deletePayment = async (id: number) => {
    await db.delete(PaymentsTable).where(eq(PaymentsTable.paymentId, id));
};

export const getPaymentsByUserId = async (userId: number) => {
    const result = await db.select().from(PaymentsTable).where(eq(PaymentsTable.userId, userId));
    return result[0] || null;
};
