import { db } from "../../drizzle/db";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { TSUserInsert, UsersTable } from "../../drizzle/schema";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "../../middleware/mailer";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "youcanguessit";
const verificationCode = crypto.randomBytes(3).toString("hex").toUpperCase();

export const registerUser = async (data: Omit<TSUserInsert, "customerID">) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser: TSUserInsert = {
        ...data,
        password: hashedPassword,
        isAdmin: data.isAdmin ?? false,
        verificationCode,
        isVerified: false,
    };

    const result = await db.insert(UsersTable).values(newUser).returning();

    const user = result[0];

    const token = jwt.sign(
        {
            userId: user.userId,
            email: user.email,
            isAdmin: user.isAdmin,
        },
        JWT_SECRET,
        { expiresIn: "1d" }
    );

    await sendWelcomeEmail(user.email, user.firstname, verificationCode);

    return { user, token };
};

export const loginUser = async (email: string, password: string) => {
    const user = await db
        .select()
        .from(UsersTable)
        .where(eq(UsersTable.email, email))
        .then((res) => res[0]);

    if (!user) {
        console.error("User not found for email:", email);
        throw new Error("Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        console.error("Password mismatch for user:", email);
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign({ userId: user.userId, email: user.email }, JWT_SECRET, { expiresIn: "1d" });

    return { user, token };
};

export const verifyUser = async (email: string, code: string) => {
    const user = await db
        .select()
        .from(UsersTable)
        .where(eq(UsersTable.email, email))
        .then((res) => res[0]);

    if (!user) {
        throw new Error("User not found");
    }

    if (user.isVerified) {
        throw new Error("User already verified");
    }

    console.log(user.verificationCode, code);
    if (user.verificationCode !== code) {
        throw new Error("Invalid verification code");
    }

    await db.update(UsersTable).set({ isVerified: true }).where(eq(UsersTable.email, email));

    return { message: "Account verified successfully" };
};
