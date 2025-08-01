import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendWelcomeEmail = async (to: string, name: string, verificationCode: string) => {
    await transporter.sendMail({
        from: `"Josh Hotel" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Welcome to Josh Hotel!",
        html: `
            <h1>Hi ${name}</h1>
            <p>Thanks for joining Josh Hotel. We're excited to have you on board.</p>
            <p>Best regards,<br>Josh Hotel Team</p>
            <p>Verification code: <h3>${verificationCode}</h3></p>
            <p>If you did not request this email, please ignore it.</p>
        `,
    });
};
