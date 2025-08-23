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
            await this.service.createRating(data);
        } catch (error) {
            console.log(error);

            return res.status(422).json({
                error: error.message || "something went wrong"
            });
        }
    }
}

export default new RatingController();
