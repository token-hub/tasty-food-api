import RatingModel from "./model.js";
import { ObjectId } from "mongodb";

class RatingService {
    #model;
    #pagination = {
        page: 1,
        cursor: "",
        limit: 6,
        sortBy: "updatedAt",
        order: -1
    };

    constructor() {
        this.#model = RatingModel;
    }

    get model() {
        return this.#model;
    }

    set paginationData(data) {
        this.#pagination = { ...this.#pagination, ...data };
    }

    get paginationData() {
        return this.#pagination;
    }

    transfromData(data) {
        data.recipeId = new ObjectId(data.recipeId);
        return data;
    }

    getQueryAllRating(data) {
        let query = { recipeId: data.recipeId };
        const { limit, page, cursor, order } = this.paginationData;
        let skip = limit * (page - 1) > 1 ? limit * (page - 1) : 1;

        if (order == 1) {
            skip = skip - 1;
        }

        if (cursor) {
            query.updatedAt = { [order == -1 ? "$lte" : "$gte"]: new Date(cursor) };
        }

        return { query, skip };
    }

    createRating(data) {
        // add validation

        if (!data) {
            throw new Error("Missing required Data");
        }

        if (data.recipeId) {
            data.recipeId = new ObjectId(data.recipeId);
        }

        if (data?.rater.raterId) {
            data.rater.raterId = new ObjectId(data?.rater.raterId);
        }

        // make the data.comment only required if the rating is below 4
        // notify the author here

        return this.model.create(data);
    }

    async getAllRating(data) {
        this.paginationData = data.pagination;
        delete data.pagination;
        // add validation

        data = this.transfromData(data);
        const { query, skip } = this.getQueryAllRating(data);
        const { sortBy, order, limit, page } = this.paginationData;

        const ratings = await this.model
            .find(query)
            .skip(skip)
            .sort({ [sortBy]: order })
            .limit(limit);

        return {
            ratings,
            page
        };
    }
}

export default RatingService;
