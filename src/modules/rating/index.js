import express from "express";
const router = express.Router();

import RatingController from "./controller.js";

router.post("/", (req, res, next) => RatingController.createRating(req, res, next));

export default router;
