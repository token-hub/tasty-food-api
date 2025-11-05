import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import client from "./db/db.js";
import { sendEmail } from "./email.js";
const db = client.db(process.env.MONGODB_DATABASE);

export const auth = betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url, token }, request) => {
            const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password?token=${token}`;

            await sendEmail({
                to: user.email,
                subject: "Reset your password",
                text: `Click the link to reset your password: ${resetUrl}`,
            });
        },
        onPasswordReset: async ({ user }, request) => {
            console.log(`Password for user ${user.email} has been reset.`);
        },
    },
    advanced: {
        defaultCookieAttributes: {
            sameSite: "none",
            secure: true,
        },
    },
    trustedOrigins: [process.env.CLIENT_URL],
    user: {
        modelName: "users",
    },
    session: {
        modelName: "sessions",
    },
    account: {
        modelName: "accounts",
    },
    verification: {
        modelName: "verifications",
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url, token }, request) => {
            const baseUrl = process.env.SERVER_URL;
            const CLIENT_URL = process.env.CLIENT_URL;
            const fullUrl = `${baseUrl}/api/auth/verifyEmail?token=${token}&callbackURL=${CLIENT_URL}/auth/email-verified`;

            await sendEmail({
                to: user.email,
                subject: "Verify your email address",
                text: `Click the link to verify your email: ${fullUrl}`,
            });
        },
    },
});
