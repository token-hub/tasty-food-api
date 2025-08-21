import RecipeService from "./service.js";

class RecipeController {
    async createRecipe(req, res) {
        try {
            const userData = req.body;
            const service = new RecipeService();
            const newRecipe = await service.createRecipe(userData);
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
}

export default new RecipeController();
