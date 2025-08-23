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
        if (data.recipeId) {
            data.recipeId = new ObjectId(data.recipeId);
        }

        if (data.raterId) {
            data.raterId = new ObjectId(data.raterId);
        }

        return data;
    }

    getQueryAllRating(data) {
        let query = { recipeId: data.recipeId };
        const { limit, page, cursor, order } = this.paginationData;

        let defaultSkip = limit * (page - 1);
        let isNotFirstPage = defaultSkip > 0;
        let skip = isNotFirstPage ? defaultSkip : 0;

        if (order == 1) {
            // need to skip 1 if user wants to be previous page due to using $gte
            // it will match the first data of the current page
            // and we want to skip that so that all the data from the previous
            // page will correctly be fetch
            let isSkipPositive = skip - 1 > 0;
            skip = isSkipPositive ? skip - 1 : 1;
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

    async getRating(data) {
        // add validation for data.raterId and data.recipeId
        data = this.transfromData(data);

        return await this.model.findOne({ recipeId: data.recipeId, "rater.raterId": data.raterId });
    }

    async editRating() {}
}

export default RatingService;
