import RecipeController from "./controller.js";

function recipeRoutes(router) {
    router.get("/", async (req, res) => {
        await RecipeController.getAllRecipes(req, res);
    });
    return router;
}

export default recipeRoutes;
