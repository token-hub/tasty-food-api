import RatingService from "./service.js";
import { handleErrors } from "../../utils/helper.js";

class RatingController {
    #service;

    constructor() {
        this.#service = new RatingService();
    }

    get service() {
        return this.#service;
    }

    async createRating(req, res, next) {
        try {
            const data = req.body;
            const rating = await this.service.createRating(data);

            return res.status(201).json({
                status: "Success",
                details: rating
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new RatingController();
