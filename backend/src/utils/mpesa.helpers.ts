import axios from "axios";
import dayjs from "dayjs";

export const getAccessToken = async () => {
    const consumerKey = process.env.DARAJA_CONSUMER_KEY!;
    const consumerSecret = process.env.DARAJA_CONSUMER_SECRET!;
    const base64 = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

    try {
        const response = await axios.get(
            `${process.env.DARAJA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
            {
                headers: {
                    Authorization: `Basic ${base64}`,
                },
            }
        );

        return response.data.access_token;
    } catch (error: any) {
        console.error("Failed to get access token:", error.response?.data || error.message);
        throw new Error("Failed to get Daraja access token");
    }
};

export const generatePassword = () => {
    const timestamp = dayjs().format("YYYYMMDDHHmmss");
    const password = Buffer.from(`${process.env.DARAJA_SHORTCODE}${process.env.DARAJA_PASSKEY}${timestamp}`).toString(
        "base64"
    );

    return { password, timestamp };
};
