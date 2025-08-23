import RatingModel from "./model.js";

class RatingService {
    #model;

    constructor() {
        this.#model = new RatingModel();
    }

    get model() {
        return this.#model;
    }

    createRating(data) {
        if (!data) {
            throw new Error("Missing required Data");
        }
        return this.model.create(data);
    }
}

export default RatingService;
