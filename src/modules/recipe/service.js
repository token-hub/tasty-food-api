import RecipeModel from "./model.js";
import { ObjectId } from "mongodb";

class RecipeService {
    #model;
    #pagination = {
        page: 1,
        cursor: "",
        limit: 6,
        sortBy: "updatedAt",
        order: -1
    };

    constructor() {
        this.#model = RecipeModel;
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

    transformData(data) {
        if (data.recipeId) {
            data.recipeId = new ObjectId(data.recipeId);
        }
    }

    getQueryAllRecipes(data) {
        const { limit, cursor, page, order } = this.paginationData;
        const { filters } = data;

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

        let query = {};
        if (cursor) {
            query.updatedAt = { [order == -1 ? "$lte" : "$gte"]: new Date(cursor) };
        }

        if (filters?.categories.length) {
            query.categories = { $in: filters.categories };
        }

        return { query, skip };
    }

    async getAllRecipes(data) {
        // add validation

        this.paginationData = data.pagination;
        delete data.pagination;

        const { query, skip } = this.getQueryAllRecipes(data);
        const { sortBy, limit, order, page } = this.paginationData;

        const recipes = await this.model
            .find(query)
            .sort({ [sortBy]: order })
            .skip(skip)
            .limit(limit);

        return {
            recipes,
            page
        };
    }

    getTotalRecipe() {
        return this.model.countDocuments();
    }

    getRecipe(recipeId) {
        if (!recipeId) {
            throw new Error("Recipe Id is missing");
        }

        const id = new ObjectId(recipeId);
        return this.model.findById(id);
    }

    createRecipe(data) {
        // implement business logic
        if (data?.author?.userId) {
            data.author.userId = new ObjectId(data.author.userId);
        }

        return this.model.create(data);
    }

    updateRecipe(data) {
        if (!data.recipeId) {
            throw new Error("Recipe Id is missing");
        }

        this.transformData(data);
        const recipeId = data.recipeId;
        delete data.recipeId;

        return this.model.findByIdAndUpdate(
            { _id: recipeId },
            {
                $set: data
            },
            {
                runValidators: true,
                returnDocument: "after"
            }
        );
    }
}

export default RecipeService;
