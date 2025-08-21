import RecipeController from "./controller.js";

function recipeRoutes(router) {
    router.get("/", (req, res) => RecipeController.getAllRecipes(req, res));
    router.post("/", (req, res) => RecipeController.createRecipe(req, res));
    return router;
}

export default recipeRoutes;
