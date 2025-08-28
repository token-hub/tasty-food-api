import NotificationModel from "./model.js";
import { ObjectId } from "mongodb";

class NotificationService {
    #model;
    #pagination = {
        cursor: "",
        limit: 5,
        sortBy: "updatedAt",
        order: -1
    };

    constructor() {
        this.#model = NotificationModel;
    }

    get model() {
        return this.#model;
    }

    set paginationData(data) {
        this.#pagination = { ...this.#pagination, ...data };
    }

    get paginationData() {
        return this.#pagination;
    }

    transformData(data) {
        if (data.userId) {
            data.userId = new ObjectId(data.userId);
        }

        if (data.pagination) {
            this.paginationData = data.pagination;
            delete data.pagination;
        }
    }

    createNotification(data) {
        // add validation
        this.transformData(data);

        return this.model.create(data);
    }

    getNotificationsQuery(data) {
        const query = {
            userId: data.userId
        };

        if (this.paginationData.cursor) {
            query.updatedAt = { $lt: new Date(this.paginationData.cursor) };
        }

        return query;
    }

    async getNotifications(data) {
        this.transformData(data);

        const query = this.getNotificationsQuery(data);
        const { sortBy, order, limit } = this.paginationData;
        return this.model
            .find(query)
            .sort({ [sortBy]: order })
            .limit(limit);
    }

    getUnReadNotificationsCount() {}

    updateNotification() {}
}

export default NotificationService;
