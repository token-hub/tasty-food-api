import RatingModel from "./model.js";
import { ObjectId } from "mongodb";

class RatingService {
    #model;

    constructor() {
        this.#model = RatingModel;
    }

    get model() {
        return this.#model;
    }

    createRating(data) {
        if (!data) {
            throw new Error("Missing required Data");
        }

        if (data.recipeId) {
            data.recipeId = new ObjectId(data.recipeId);
        }

        if (data?.rater.raterId) {
            data.rater.raterId = new ObjectId(data?.rater.raterId);
        }

        return this.model.create(data);
    }
}

export default RatingService;
