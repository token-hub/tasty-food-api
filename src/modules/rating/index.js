import express from "express";
const router = express.Router();

import RatingController from "./controller.js";

router.post("/", RatingController.createRating);
router.get("/", RatingController.getAllRating);
router.get("/:recipeId/:raterId", RatingController.getRating);

export default router;
