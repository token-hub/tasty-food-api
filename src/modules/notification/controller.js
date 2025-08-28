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
}

export default new NotificationController();
