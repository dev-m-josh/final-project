import axios from "axios";
import {db} from "../../drizzle/db";
import { PaymentsTable } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { getAccessToken, generatePassword } from "../../utils/mpesa.helpers";
import { normalizePhoneNumber } from '../../utils/normalizePhoneNumber';

export const initiateStkPush = async ({
    phoneNumber,
    amount,
    paymentId,
}: {
    phoneNumber: string;
    amount: number;
    paymentId: number;
}) => {
    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    const token = await getAccessToken();
    const { password, timestamp } = generatePassword();

    try {
        const response = await axios.post(
            `https://${
                process.env.DARAJA_ENVIRONMENT === "sandbox" ? "sandbox" : "api"
            }.safaricom.co.ke/mpesa/stkpush/v1/processrequest`,
            {
                BusinessShortCode: process.env.DARAJA_SHORTCODE,
                Password: password,
                Timestamp: timestamp,
                TransactionType: "CustomerPayBillOnline",
                Amount: amount,
                PartyA: normalizedPhone,
                PartyB: process.env.DARAJA_SHORTCODE,
                PhoneNumber: normalizedPhone,
                CallBackURL: `${process.env.DARAJA_CALLBACK_URL}?payment_id=${paymentId}`,
                AccountReference: "EventBooking",
                TransactionDesc: "Ticket Payment",
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error: any) {
        console.error("STK Push Axios Error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });
        throw new Error("STK push failed");
    }
};


export const handleMpesaCallback = async (paymentId: number, callbackBody: any) => {
    const stkCallback = callbackBody.Body?.stkCallback;

    if (!stkCallback || stkCallback.ResultCode !== 0) return;

    const mpesaReceipt = stkCallback.CallbackMetadata?.Item.find(
        (item: any) => item.Name === "MpesaReceiptNumber"
    )?.Value;

    await db
        .update(PaymentsTable)
        .set({
            isPaid: true,
            transactionId: mpesaReceipt,
            updatedAt: new Date(),
        })
        .where(eq(PaymentsTable.transactionId, String(paymentId)));
};
