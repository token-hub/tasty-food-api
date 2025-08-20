import RecipeService from "./service.js";

async function getAllRecipes(req, res) {
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
        console.log(error);
    }
}

export default getAllRecipes;
