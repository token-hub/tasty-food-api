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
                details: newRecipe
            });
        } catch (error) {
            next(error);
        }
    };

    getAllRecipes = async (req, res, next) => {
        try {
            const options = req.body;
            const details = await this.service.getAllRecipes(options);
            res.status(200).json({
                status: "success",
                details
            });
        } catch (error) {
            next(error);
        }
    };

    getRecipe = async (req, res, next) => {
        try {
            const data = req.params;
            const recipe = await this.service.getRecipe(data);
            res.status(200).json({
                status: "success",
                details: recipe
            });
        } catch (error) {
            next(error);
        }
    };

    updateRecipe = async (req, res, next) => {
        try {
            const data = req.body;
            const headers = req.headers;
            data.recipeId = req.params?.recipeId;
            const recipe = await this.service.updateRecipe(data, headers);
            res.status(200).json({
                status: "Recipe successfully updated",
                details: recipe
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new RecipeController();
