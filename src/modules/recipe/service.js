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

    async getAllRecipes({ page = 1, limit = 6 } = {}) {
        const skip = (page - 1) * limit;

        const [recipes, total] = await Promise.all([this.model.find().skip(skip).limit(limit), this.model.countDocuments()]);

        return {
            recipes,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
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
