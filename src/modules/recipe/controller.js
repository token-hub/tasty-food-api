import RecipeService from "./service.js";

class RecipeController {
    #service;

    constructor() {
        this.#service = new RecipeService();
    }

    get service() {
        return this.#service;
    }

    createRecipe = async (req, res, next) => {
        try {
            const userData = req.body;
            const newRecipe = await this.service.createRecipe(userData);
            res.status(200).json({
                status: "success",
                message: "recipe created successfully.",
                data: newRecipe
            });
        } catch (error) {
            next(error);
        }
    };

    getAllRecipes = async (req, res, next) => {
        try {
            const options = req.body;
            const data = await this.service.getAllRecipes(options);
            res.status(200).json({
                status: "success",
                data
            });
        } catch (error) {
            next(error);
        }
    };

    getRecipe = async (req, res, next) => {
        try {
            const recipeId = req.params?.recipeId;
            const recipe = await this.service.getRecipe(recipeId);
            res.status(200).json({
                status: "success",
                data: recipe
            });
        } catch (error) {
            next(error);
        }
    };

    updateRecipe = async (req, res, next) => {
        try {
            const data = req.body;
            data.recipeId = req.params?.recipeId;
            const recipe = await this.service.updateRecipe(recipeId, data);
            res.status(200).json({
                status: "Recipe successfully updated",
                data: recipe
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new RecipeController();
