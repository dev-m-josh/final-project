// src/controllers/payments.controller.ts
import { Request, Response } from "express";
import * as paymentService from "./payment.service";

export const getAllPayments = async (_req: Request, res: Response) => {
    try {
        const payments = await paymentService.getAllPayments();
        res.json(payments);
    } catch (error) {
        console.error("Error fetching payments:", error);
        res.status(500).json({ message: "Failed to fetch payments" });
    }
};

export const getPaymentById = async (req: Request, res: Response) => {
    try {
        const paymentId = Number(req.params.id);
        const payment = await paymentService.getPaymentById(paymentId);

        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        res.json(payment);
    } catch (error) {
        console.error("Error fetching payment:", error);
        res.status(500).json({ message: "Failed to fetch payment" });
    }
};

export const createPayment = async (req: Request, res: Response) => {
    try {
        const payment = await paymentService.createPayment(req.body);
        res.status(201).json(payment);
    } catch (error) {
        console.error("Error creating payment:", error);
        res.status(500).json({ message: "Failed to create payment" });
    }
};

export const updatePayment = async (req: Request, res: Response) => {
    try {
        const paymentId = Number(req.params.id);
        const existing = await paymentService.getPaymentById(paymentId);

        if (!existing) {
            return res.status(404).json({ message: "Payment not found" });
        }

        const updated = await paymentService.updatePayment(paymentId, req.body);
        res.json(updated);
    } catch (error) {
        console.error("Error updating payment:", error);
        res.status(500).json({ message: "Failed to update payment" });
    }
};

export const deletePayment = async (req: Request, res: Response) => {
    try {
        const paymentId = Number(req.params.id);
        const existing = await paymentService.getPaymentById(paymentId);

        if (!existing) {
            return res.status(404).json({ message: "Payment not found" });
        }

        await paymentService.deletePayment(paymentId);
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting payment:", error);
        res.status(500).json({ message: "Failed to delete payment" });
    }
};

export const getPaymentsByUserId = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.userId);
        const payments = await paymentService.getPaymentsByUserId(userId);
        res.json(payments);
    } catch (error) {
        console.error("Error fetching payments by userId:", error);
        res.status(500).json({ message: "Failed to fetch payments by user" });
    }
};