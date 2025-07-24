import { Request, Response, RequestHandler } from "express";
import { initiateStkPush, handleMpesaCallback } from "./daraja.service";

// STK Push Controller
export const stkPushController: RequestHandler = async (req, res): Promise<void> => {
    try {
        const { phoneNumber, amount, paymentId } = req.body;

        if (!phoneNumber || !amount || !paymentId) {
            res.status(400).json({
                success: false,
                message: "Missing required fields: phoneNumber, amount, or paymentId",
            });
            return;
        }

        const data = await initiateStkPush({
            phoneNumber,
            amount: Number(amount),
            paymentId: Number(paymentId),
        });

        res.status(200).json({ success: true, data });
    } catch (error: any) {
        // 🧠 This logs everything so you see the actual cause
        console.error("STK Push Error:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
        });

        const safaricomError = error.response?.data?.errorMessage || error.message || "Unknown error";

        res.status(500).json({
            success: false,
            message: "STK push failed",
            error: safaricomError,
        });
    }
};

// M-Pesa Callback Controller
export const mpesaCallbackController: RequestHandler = async (req, res): Promise<void> => {
    try {
        const paymentId = Number(req.query.payment_id);

        if (isNaN(paymentId)) {
            res.status(400).json({ message: "Invalid or missing payment_id" });
            return;
        }

        await handleMpesaCallback(paymentId, req.body);
        res.status(200).json({ message: "Callback processed successfully" });
    } catch (error) {
        console.error("Callback Error:", (error as Error).message);
        res.status(500).json({ message: "Failed to handle callback" });
    }
};
