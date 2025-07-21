import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const {
    DARAJA_CONSUMER_KEY,
    DARAJA_CONSUMER_SECRET,
    DARAJA_SHORTCODE,
    DARAJA_PASSKEY,
    DARAJA_BASE_URL,
    DARAJA_CALLBACK_URL,
} = process.env;

// Generate Base64-encoded credentials
const auth = Buffer.from(`${DARAJA_CONSUMER_KEY}:${DARAJA_CONSUMER_SECRET}`).toString("base64");

// Get OAuth token
export const getAccessToken = async () => {
    const response = await axios.get(`${DARAJA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
        headers: {
            Authorization: `Basic ${auth}`,
        },
    });
    return response.data.access_token;
};

// Generate timestamp in format YYYYMMDDHHMMSS
const generateTimestamp = () => {
    const now = new Date();
    return now
        .toISOString()
        .replace(/[-T:\.Z]/g, "")
        .slice(0, 14);
};

// Generate password for STK push
const generatePassword = (timestamp: string) => {
    return Buffer.from(`${DARAJA_SHORTCODE}${DARAJA_PASSKEY}${timestamp}`).toString("base64");
};

// Initiate STK push
export const initiateSTKPush = async ({
    phoneNumber,
    amount,
    accountReference = "HotelBooking",
    transactionDesc = "Hotel Booking Payment",
}: {
    phoneNumber: string;
    amount: number;
    accountReference?: string;
    transactionDesc?: string;
}) => {
    const accessToken = await getAccessToken();
    const timestamp = generateTimestamp();
    const password = generatePassword(timestamp);

    const payload = {
        BusinessShortCode: DARAJA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: DARAJA_SHORTCODE,
        PhoneNumber: phoneNumber,
        CallBackURL: DARAJA_CALLBACK_URL,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc,
    };

    const response = await axios.post(`${DARAJA_BASE_URL}/mpesa/stkpush/v1/processrequest`, payload, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
};
