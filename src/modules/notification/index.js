import express from "express";
const router = express.Router();

import NotificationController from "./controller.js";

router.post("/", NotificationController.createNotification);
router.get("/", NotificationController.getNotifications);

export default router;
