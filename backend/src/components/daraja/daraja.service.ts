import axios from "axios";
import {db} from "../../drizzle/db";
import { PaymentsTable } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { normalizePhoneNumber } from '../../utils/normalizePhoneNumber';
import dayjs from "dayjs";

const generatePassword = () => {
    const timestamp = dayjs().format("YYYYMMDDHHmmss");
    const password = Buffer.from(`${process.env.DARAJA_SHORTCODE}${process.env.DARAJA_PASSKEY}${timestamp}`).toString(
        "base64"
    );

    return { password, timestamp };
};

// Get access token
const getAccessToken = async () => {
    const { data } = await axios.get(
        `https://${
            process.env.DARAJA_ENVIRONMENT === "sandbox" ? "sandbox" : "api"
        }.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials`,
        {
            auth: {
                username: process.env.DARAJA_CONSUMER_KEY!,
                password: process.env.DARAJA_CONSUMER_SECRET!,
            },
        }
    );

    return data.access_token;
};

// Main STK Push function
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

    const url = `https://${
        process.env.DARAJA_ENVIRONMENT === "sandbox" ? "sandbox" : "api"
    }.safaricom.co.ke/mpesa/stkpush/v1/processrequest`;

    const payload = {
        BusinessShortCode: process.env.DARAJA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: normalizedPhone,
        PartyB: process.env.DARAJA_SHORTCODE,
        PhoneNumber: normalizedPhone,
        CallBackURL: `https://mydomain.com/path`,
        AccountReference: "EventBooking",
        TransactionDesc: "Ticket Payment",
    };

    try {
        const response = await axios.post(url, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error: any) {
        console.error("STK Push Error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });

        throw new Error(error.response?.data?.errorMessage || "STK push failed unexpectedly");
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
