import RecipeController from "./controller.js";

function recipeRoutes(router) {
    router.get("/", (req, res) => RecipeController.getAllRecipes(req, res));
    router.post("/", (req, res) => RecipeController.createRecipe(req, res));
    router.get("/:recipeId", (req, res) => RecipeController.getRecipe(req, res));
    router.put("/:recipeId", (req, res) => RecipeController.updateRecipe(req, res));
    return router;
}

export default recipeRoutes;
