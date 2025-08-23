import RatingService from "./service.js";

class RatingController {
    #service;

    constructor() {
        this.#service = new RatingService();
    }

    get service() {
        return this.#service;
    }

    async createRating(req, res) {
        try {
            const data = req.body;
            const rating = await this.service.createRating(data);

            return res.status(201).json({
                status: "Success",
                details: rating
            });
        } catch (error) {
            if (error.errors) {
                const errors = Object.entries(error.errors).map((err) => {
                    return {
                        [err[0]]: err[1].message
                    };
                });
                return res.status(422).json({
                    error: error._message,
                    details: errors
                });
            }

            return res.status(422).json({
                error: error.message || "something went wrong"
            });
        }
    }
}

export default new RatingController();
