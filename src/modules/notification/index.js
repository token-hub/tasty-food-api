import express from "express";
const router = express.Router();

import NotificationController from "./controller.js";

router.post("/", NotificationController.createNotification);
router.post("/getNotifications", NotificationController.getNotifications);
router.get("/:userId/notificationCount", NotificationController.getNotificationCount);
router.put("/:notificationId", NotificationController.updateNotificationIsRead);
router.put("/markAllUnread/:userId", NotificationController.markAllUnReadNotifToRead);

export default router;
