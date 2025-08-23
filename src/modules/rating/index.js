import express from "express";
const router = express.Router();

import RatingController from "./controller.js";

router.post("/", RatingController.createRating);

export default router;
