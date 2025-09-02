import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import client from "./db/db.js";

const db = client.db(process.env.MONGODB_DATABASE);

export const auth = betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: {
        enabled: true
    },
    advanced: {
        defaultCookieAttributes: {
            sameSite: "none",
            secure: true
        }
    },
    trustedOrigins: [process.env.CLIENT_URL],
    user: {
        modelName: "users"
    },
    session: {
        modelName: "sessions"
    },
    account: {
        modelName: "accounts"
    },
    verification: {
        modelName: "verifications"
    }
});
