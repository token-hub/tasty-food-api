import express from "express";
const router = express.Router();
import RecipeController from "./controller.js";

router.get("/", (req, res) => RecipeController.getAllRecipes(req, res));
router.post("/", (req, res) => RecipeController.createRecipe(req, res));
router.get("/:recipeId", (req, res) => RecipeController.getRecipe(req, res));
router.put("/:recipeId", (req, res) => RecipeController.updateRecipe(req, res));

export default router;
