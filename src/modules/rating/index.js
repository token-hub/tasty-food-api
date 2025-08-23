import express from "express";
const router = express.Router();

import RatingController from "./controller.js";

router.post("/", (req, res) => RatingController.createRating(req, res));

export default router;
