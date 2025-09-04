import AuthService from "./service.js";

class AuthController {
    #service;

    constructor() {
        this.#service = new AuthService();
    }

    get service() {
        return this.#service;
    }

    signUp = async (req, res, next) => {
        try {
            const data = req.body;
            const result = await this.service.signUp(data);
            return res.status(201).json({
                status: "Success",
                details: result
            });
        } catch (error) {
            next(error);
        }
    };

    signIn = async (req, res, next) => {
        try {
            const data = req.body;
            const headers = req.headers;
            const { setCookie, response } = await this.service.signIn(data, headers);

            if (setCookie) {
                res.setHeader("Set-Cookie", setCookie);
            }

            return res.status(200).json({
                status: "Success",
                details: response
            });
        } catch (error) {
            next(error);
        }
    };

    signOut = async (req, res, next) => {
        try {
            const headers = req.headers;
            const { setCookie, response } = await this.service.signOut(headers);

            if (setCookie) {
                res.setHeader("Set-Cookie", setCookie);
            }

            return res.status(200).json({
                status: "Success",
                details: response
            });
        } catch (error) {
            next(error);
        }
    };

    sendEmailVerification = async (req, res, next) => {
        try {
            const data = req.body;
            const result = await this.service.sendEmailVerification(data);

            return res.status(200).json({
                status: "Success",
                details: result
            });
        } catch (error) {
            next(error);
        }
    };

    verifyEmail = async (req, res, next) => {
        try {
            const data = req.query;
            await this.service.verifyEmail(data);
            const redirect = `${process.env.CLIENT_URL}/emailVerified`;
            return res.redirect(redirect);
        } catch (error) {
            next(error);
        }
    };

    getSession = async (req, res, next) => {
        try {
            const headers = req.headers;
            const session = await this.service.getSession(headers);
            return res.status(200).json({
                status: "Success",
                details: session
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new AuthController();
