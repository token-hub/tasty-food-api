import express from "express";
const router = express.Router();

import NotificationController from "./controller.js";

router.post("/", NotificationController.createNotification);
router.get("/", NotificationController.getNotifications);
router.get("/:userId", NotificationController.getUnreadNotificationsCount);
router.put("/:notificationId", NotificationController.updateNotificationIsRead);
router.put("/markAllUnread/:userId", NotificationController.markAllUnReadNotifToRead);

export default router;
