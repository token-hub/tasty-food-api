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
}

export default new AuthController();
