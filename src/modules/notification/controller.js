import NotificationService from "./service.js";

class NotificationController {
    #service;

    constructor() {
        this.#service = new NotificationService();
    }

    get service() {
        return this.#service;
    }

    createNotification = async (req, res, next) => {
        try {
            const data = req.body;
            const notification = await this.service.createNotification(data);
            return res.status(201).json({
                status: "Success",
                details: notification
            });
        } catch (error) {
            next(error);
        }
    };

    getNotifications = async (req, res, next) => {
        try {
            const data = req.body;
            const notifications = await this.service.getNotifications(data);
            return res.status(200).json({
                status: "Success",
                details: notifications
            });
        } catch (error) {
            next(error);
        }
    };

    getNotificationCount = async (req, res, next) => {
        try {
            const data = req.params;
            const notificationCount = await this.service.getNotificationCount(data);
            return res.status(200).json({
                status: "Success",
                details: notificationCount
            });
        } catch (error) {
            next(error);
        }
    };

    updateNotificationIsRead = async (req, res, next) => {
        try {
            const data = req.params;
            const updatedNotification = await this.service.updateNotificationIsRead(data);
            return res.status(200).json({
                status: "Success",
                details: updatedNotification
            });
        } catch (error) {
            next(error);
        }
    };

    markAllUnReadNotifToRead = async (req, res, next) => {
        try {
            const data = req.params;
            const updatedNotifications = await this.service.markAllUnReadNotifToRead(data);
            return res.status(200).json({
                status: "Success",
                details: updatedNotifications
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new NotificationController();
