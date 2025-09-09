import RecipeModel from "./model.js";
import { ObjectId } from "mongodb";
import AuthService from "../auth/service.js";

class RecipeService {
    #model;
    #authService;
    #pagination = {
        page: 1,
        cursor: "",
        limit: 6,
        sortBy: "updatedAt",
        order: -1
    };

    constructor() {
        this.#model = RecipeModel;
        this.#authService = new AuthService();
    }

    get authService() {
        return this.#authService;
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

        if (data.author && data.author.userId) {
            data.author.userId = new ObjectId(data.author.userId);
        }
    }

    getQueryAllRecipes(data) {
        const { limit, cursor, page, order } = this.paginationData;

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

        let query = { isArchive: Boolean(data?.isArchive) };
        if (cursor) {
            query.updatedAt = { [order == -1 ? "$lte" : "$gte"]: new Date(cursor) };
        }

        if (data?.author) {
            query["author.userId"] = { $eq: data?.author?.userId };
        }

        if (data?.filters?.categories.length) {
            query.categories = { $in: data?.filters.categories };
        }

        return { query, skip };
    }

    async getAllRecipes(data) {
        // add validation

        this.paginationData = data.pagination;
        delete data.pagination;

        this.transformData(data);

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

    getRecipe(data) {
        if (!data.recipeId) {
            throw new Error("Recipe Id is missing");
        }
        this.transformData(data);
        return this.model.findById({ _id: data.recipeId }, { totalRating: 0, isArchive: 0, __v: 0 });
    }

    createRecipe(data) {
        // implement business logic
        this.transformData(data);

        return this.model.create(data);
    }

    async isRecipeAuthor(recipeId, headers) {
        const session = await this.authService.getSession(headers);
        const recipe = await this.getRecipe({ recipeId });
        const isRecipeAuthor = recipe.author.userId.equals(session?.user?.id);

        if (!isRecipeAuthor) {
            throw new Error("Action forbidden");
        }
    }

    async updateRecipe(data, headers) {
        if (!data.recipeId) {
            throw new Error("Recipe Id is missing");
        }

        this.transformData(data);
        const recipeId = data.recipeId;
        await this.isRecipeAuthor(recipeId, headers);

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
