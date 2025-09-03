import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export async function sendEmail({ to, subject, text }) {
    try {
        await transporter.sendMail({
            from: "tastyfood@gmail.com",
            to,
            subject,
            text
        });
    } catch (error) {
        throw error;
    }
}
