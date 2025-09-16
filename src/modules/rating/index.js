import express from "express";
const router = express.Router();

import RatingController from "./controller.js";

router.post("/", RatingController.createRating);
router.post("/getRatings", RatingController.getAllRating);
router.get("/:recipeId/:raterId", RatingController.getRating);
router.get("/:recipeId/getRatings/totalCount", RatingController.getRatingsTotalCount);
router.put("/:ratingId/:likerId", RatingController.likeUnlikeRating);

export default router;
