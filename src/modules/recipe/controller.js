import RecipeService from "./service.js";

class RecipeController {
    #service;

    constructor() {
        this.#service = new RecipeService();
    }

    get service() {
        return this.#service;
    }

    async createRecipe(req, res) {
        try {
            const userData = req.body;
            const newRecipe = await this.service.createRecipe(userData);
            res.status(200).json({
                status: "success",
                message: "recipe created successfully.",
                data: {
                    newRecipe
                }
            });
        } catch (error) {
            if (error.errors) {
                const errors = Object.entries(error.errors).map((err) => {
                    return {
                        [err[0]]: err[1].message
                    };
                });
                return res.status(422).json({
                    error: error._message,
                    details: errors
                });
            }

            return res.status(422).json({
                error: "something went wrong"
            });
        }
    }

    async getAllRecipes(req, res) {
        try {
            const recipes = await await this.service.getAllRecipes();
            res.status(200).json({
                status: "success",
                data: recipes
            });
        } catch (error) {
            return res.status(422).json({
                error: "something went wrong"
            });
        }
    }

    async getRecipe(req, res) {
        try {
            const recipeId = req.params?.recipeId;
            const recipe = await this.service.getRecipe(recipeId);
            res.status(200).json({
                status: "success",
                data: recipe
            });
        } catch (error) {
            return res.status(422).json({
                error: "something went wrong"
            });
        }
    }

    async updateRecipe(req, res) {
        try {
            const recipeId = req.params?.recipeId;
            const data = req.body;
            const recipe = await this.service.updateRecipe(recipeId, data);
            res.status(200).json({
                status: "Recipe successfully updated",
                data: recipe
            });
        } catch (error) {
            return res.status(422).json({
                error: "something went wrong"
            });
        }
    }
}

export default new RecipeController();
