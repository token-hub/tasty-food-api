import express from "express";
const router = express.Router();

import ReportController from "./controller.js";

router.post("/", ReportController.createReport);

export default router;
