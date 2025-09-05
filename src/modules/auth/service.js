import { auth } from "../../utils/auth.js";

class AuthService {
    #auth;

    constructor() {
        this.#auth = auth;
    }

    get auth() {
        return this.#auth;
    }

    signUp(data) {
        // add validation
        // data should have, name, email, and password

        return this.auth.api.signUpEmail({
            body: data
        });
    }

    async signIn(data, headers) {
        // add validation, make sure that headers is present
        // email and password must be present too
        const result = await this.auth.api.signInEmail({
            returnHeaders: true,
            body: data,
            headers
        });

        const setCookie = result.headers.get("set-cookie");

        return { setCookie, response: result.response };
    }

    async signOut(headers) {
        // add validation, make sure that headers is present
        const result = await this.auth.api.signOut({ headers, returnHeaders: true });
        const setCookie = result.headers.get("set-cookie");

        return { setCookie, response: result.response };
    }

    async sendEmailVerification(data) {
        // add validation, make sure email is present
        return this.auth.api.sendVerificationEmail({
            body: { email: data.email, callbackURL: `${process.env.CLIENT_URL}/auth/email-verified` }
        });
    }

    verifyEmail(data) {
        // add validation, make sure the token is present
        return this.auth.api.verifyEmail({
            query: {
                token: data.token
            }
        });
    }

    getSession(headers) {
        return this.auth.api.getSession({ headers });
    }

    requestPasswordReset(data) {
        // add validation to make sure, email and redirectTo is present
        return this.auth.api.requestPasswordReset({
            body: data
        });
    }

    passwordReset(data) {
        // add validation to make user, email and password is present

        return this.auth.api.resetPassword({
            body: {
                newPassword: data.password,
                token: data.token
            }
        });
    }

    changePassword(data, headers) {
        // add validation to make user, newPassword and currentPassword is present

        if (data.password !== data.confirmPassword) {
            throw new Error("New password and Confirm password must match");
        }

        return this.auth.api.changePassword({
            body: {
                newPassword: data.password,
                currentPassword: data.oldPassword,
                revokeOtherSessions: true
            },
            headers
        });
    }
}

export default AuthService;
