import UserService from "./service.js";

class UserController {
    #service;
    constructor() {
        this.#service = new UserService();
    }

    get service() {
        return this.#service;
    }

    createUser = async (req, res, next) => {
        try {
            const data = req.body;
            const user = await this.service.createUser(data);

            return res.status(201).json({
                status: "Success",
                details: user
            });
        } catch (error) {
            next(error);
        }
    };

    updateUser = async (req, res, next) => {
        try {
            const data = {
                ...req.body,
                userId: req.params.userId
            };

            const user = await this.service.updateUser(data);

            return res.status(200).json({
                status: "Success",
                details: user
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new UserController();
