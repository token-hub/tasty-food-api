import RecipeModel from "./model.js";

class RecipeService {
    createRecipe(data) {
        // implement business logic
        return RecipeModel.create(data);
    }
}

export default RecipeService;
