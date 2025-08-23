import RecipeModel from "./model.js";
import { ObjectId } from "mongodb";

class RecipeService {
    #model;

    constructor() {
        this.#model = RecipeModel;
    }

    get model() {
        return this.#model;
    }

    async getAllRecipes({
        page = 1,
        cursor,
        filters = {
            categories: []
        },
        limit = 6,
        sortBy = "updatedAt",
        order = -1
    } = {}) {
        let skip = limit * (page - 1);

        if (order == 1) {
            skip = skip - 1;
        }

        let query = {};
        if (cursor) {
            query.updatedAt = { [order == -1 ? "$lte" : "$gte"]: new Date(cursor) };
        }

        if (filters?.categories.length) {
            query.categories = { $in: filters.categories };
        }

        const recipes = await this.model
            .find(query)
            .skip(skip)
            .sort({ [sortBy]: order })
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

    updateRecipe(recipeId, data) {
        if (!recipeId) {
            throw new Error("Recipe Id is missing");
        }

        const id = new ObjectId(recipeId);

        return this.model.findByIdAndUpdate(id, data, {
            runValidators: true,
            returnDocument: "after"
        });
    }
}

export default RecipeService;
