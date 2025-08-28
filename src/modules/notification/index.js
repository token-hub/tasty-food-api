import express from "express";
const router = express.Router();

import NotificationController from "./controller.js";

router.post("/", NotificationController.createNotification);

export default router;
