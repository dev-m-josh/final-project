export function normalizePhoneNumber(phone: string | number): string {
    if (!phone) throw new Error("Phone number is required");

    const phoneStr = String(phone).trim();

    const cleaned = phoneStr.replace(/[^\d]/g, "");

    if (cleaned.startsWith("0") && cleaned.length === 10) {
        return `254${cleaned.substring(1)}`;
    }

    if (cleaned.startsWith("1") && cleaned.length === 10) {
        return `254${cleaned}`;
    }

    if (cleaned.startsWith("254") && cleaned.length === 12) {
        return cleaned;
    }

    throw new Error("Invalid phone number format");
}
