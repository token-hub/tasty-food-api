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

        if (data.notificationId) {
            data.notificationId = new ObjectId(data.notificationId);
        }
    }

    createNotification(data) {
        // add validation
        this.transformData(data);

        return this.model.create(data);
    }

    getNotificationsQuery(data, isUnreadOnly = false) {
        const query = {
            userId: data.userId
        };

        if (isUnreadOnly) {
            query.isRead = false;
        }

        if (this.paginationData.cursor) {
            query.updatedAt = { $lt: new Date(this.paginationData.cursor) };
        }

        return query;
    }

    async getNotifications(data) {
        // add validation
        this.transformData(data);

        const query = this.getNotificationsQuery(data);
        const { sortBy, order, limit } = this.paginationData;
        return this.model
            .find(query)
            .sort({ [sortBy]: order })
            .limit(limit);
    }

    getUnReadNotificationsCount(data) {
        // add validation
        this.transformData(data);
        const query = this.getNotificationsQuery(data, true);
        return this.model.countDocuments(query);
    }

    getNotification(notificationId) {
        return this.model.findOne({ _id: notificationId }).lean();
    }

    async updateNotificationIsRead(data) {
        // add validation
        this.transformData(data);

        const notification = await this.getNotification(data.notificationId);

        if (!notification) {
            throw new Error("Cannot find notification");
        }

        return this.model.findOneAndUpdate(
            { _id: notification._id },
            {
                $set: {
                    isRead: true
                }
            },
            {
                runValidators: true,
                new: true
            }
        );
    }
}

export default NotificationService;
