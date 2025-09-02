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

    login = async (req, res, next) => {
        try {
            const data = req.body;
            const headers = req.headers;
            const result = await this.service.login(data, headers);
            return res.status(200).json({
                status: "Success",
                details: result
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new AuthController();
