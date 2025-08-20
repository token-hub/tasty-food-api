import RecipeController from "./controller.js";

function recipeRoutes(router) {
    router.get("/", RecipeController.getAllRecipes);
    return router;
}

export default recipeRoutes;
