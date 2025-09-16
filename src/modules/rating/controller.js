import RatingService from "./service.js";

class RatingController {
    #service;

    constructor() {
        this.#service = new RatingService();
    }

    get service() {
        return this.#service;
    }

    createRating = async (req, res, next) => {
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
    };

    getAllRating = async (req, res, next) => {
        try {
            const data = req.body;
            const ratings = await this.service.getAllRating(data);

            return res.status(200).json({
                status: "Success",
                details: ratings
            });
        } catch (error) {
            next(error);
        }
    };

    getRating = async (req, res, next) => {
        try {
            const data = req.params;
            const rating = await this.service.getRating(data);

            return res.status(200).json({
                status: "Success",
                details: rating
            });
        } catch (error) {
            next(error);
        }
    };

    likeUnlikeRating = async (req, res, next) => {
        try {
            const data = { ...req.params, ...req.body };
            const rating = await this.service.likeUnlikeRating(data);

            return res.status(201).json({
                status: "Success",
                details: rating
            });
        } catch (error) {
            next(error);
        }
    };

    getRatingsTotalCount = async (req, res, next) => {
        try {
            const data = req.params;
            const count = await this.service.getRatingsTotalCount(data);

            return res.status(200).json({
                status: "Success",
                details: count
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new RatingController();
