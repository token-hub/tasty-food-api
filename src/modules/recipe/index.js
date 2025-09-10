import express from "express";
const router = express.Router();
import RecipeController from "./controller.js";

router.post("/getRecipes", RecipeController.getAllRecipes);
router.post("/", RecipeController.createRecipe);
router.get("/:recipeId", RecipeController.getRecipe);
router.put("/:recipeId", RecipeController.updateRecipe);
router.get("/getRecipes/totalCount", RecipeController.getTotalRecipesCount);

export default router;
