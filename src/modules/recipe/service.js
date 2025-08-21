import RecipeModel from "./model.js";
import { ObjectId } from "mongodb";
class RecipeService {
    createRecipe(data) {
        // implement business logic
        if (data?.author?.userId) {
            data.author.userId = new ObjectId(data.author.userId);
        }

        return RecipeModel.create(data);
    }
}

export default RecipeService;
