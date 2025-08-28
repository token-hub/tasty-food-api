import NotificationModel from "./model.js";
import { ObjectId } from "mongodb";

class NotificationService {
    #model;
    constructor() {
        this.#model = NotificationModel;
    }

    get model() {
        return this.#model;
    }

    transformData(data) {
        if (data.userId) {
            data.userId = new ObjectId(data.userId);
        }
    }

    createNotification(data) {
        // add validation
        this.transformData(data);

        return this.model.create(data);
    }

    getNotifications() {}

    getUnReadNotificationsCount() {}
}

export default NotificationService;
