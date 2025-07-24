import axios from "axios";
import dayjs from "dayjs";

interface AccessTokenResponse {
    access_token: string;
    expires_in: string;
}

export const getAccessToken = async (): Promise<string> => {
    const username = process.env.DARAJA_CONSUMER_KEY;
    const password = process.env.DARAJA_CONSUMER_SECRET;

    if (!username || !password) {
        throw new Error("Missing DARAJA_CONSUMER_KEY or DARAJA_CONSUMER_SECRET");
    }

    const { data } = await axios.get<AccessTokenResponse>(
        `https://${
            process.env.DARAJA_ENVIRONMENT === "sandbox" ? "sandbox" : "api"
        }.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials`,
        {
            auth: {
                username,
                password,
            },
        }
    );
    return data.access_token;
};

export const generatePassword = () => {
    const shortcode = process.env.DARAJA_SHORTCODE;
    const passkey = process.env.DARAJA_PASSKEY;

    if (!shortcode || !passkey) {
        throw new Error("Missing DARAJA_SHORTCODE or DARAJA_PASSKEY");
    }

    const timestamp = dayjs().format("YYYYMMDDHHmmss");
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

    return { password, timestamp };
};
