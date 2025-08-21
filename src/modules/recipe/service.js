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

    getAllRecipes() {
        return this.model.find();
    }

    createRecipe(data) {
        // implement business logic
        if (data?.author?.userId) {
            data.author.userId = new ObjectId(data.author.userId);
        }

        return this.model.create(data);
    }
}

export default RecipeService;
