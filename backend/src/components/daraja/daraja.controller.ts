import { Request, Response } from "express";
import { initiateSTKPush } from "./daraja.service";

export const lipaNaMpesaOnline = async (req: Request, res: Response) => {
    try {
        const { phoneNumber, amount } = req.body;

        if (!phoneNumber || !amount) {
            return res.status(400).json({ message: "Phone number and amount are required" });
        }

        const result = await initiateSTKPush({ phoneNumber, amount });
        return res.status(200).json(result);
    } catch (error: any) {
        console.error("STK Push Error:", error.response?.data || error.message);
        return res.status(500).json({
            message: "Failed to initiate STK Push",
            error: error.response?.data || error.message,
        });
    }
};
