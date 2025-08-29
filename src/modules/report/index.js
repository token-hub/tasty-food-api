import express from "express";
const router = express.Router();

import ReportController from "./controller.js";

router.post("/", ReportController.createReport);
router.get("/", ReportController.getReports);

export default router;
