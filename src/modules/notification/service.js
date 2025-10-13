import NotificationModel from "./model.js";
import { ObjectId } from "mongodb";
import { sessionWrapper } from "../../utils/session.js";

class NotificationService {
    #model;
    #pagination = {
        cursor: "",
        limit: 5,
        sortBy: "updatedAt",
        order: -1,
        skip: 0
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
        const { cursor, order } = this.paginationData;

        const query = {
            userId: data.userId
        };

        if (isUnreadOnly) {
            query.isRead = false;
        }

        if (cursor) {
            query.updatedAt = { [order == -1 ? "$lt" : "$gt"]: new Date(cursor) };
        }

        return query;
    }

    async getNotifications(data) {
        // add validation
        this.transformData(data);

        const query = this.getNotificationsQuery(data);
        const { sortBy, order, limit, skip } = this.paginationData;

        return this.model
            .find(query)
            .sort({ [sortBy]: order })
            .skip(skip)
            .limit(limit);
    }

    getNotificationCount(data) {
        // add validation

        if (!data.userId) {
            throw new Error("User Id must not be empty");
        }

        this.transformData(data);
        const query = this.getNotificationsQuery(data);
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
                new: true
            }
        );
    }

    async markAllUnReadNotifToRead(data) {
        this.transformData(data);
        return sessionWrapper(async (session) => {
            return this.model.updateMany({ userId: data.userId, isRead: false }, { $set: { isRead: true } }, { session });
        });
    }

    async createDummy(count = 10) {
        console.log("Creating dummy notifications");
        // const arr = [];
        // for (let i = 0; i < count; i++) {
        //     arr.push({
        //         _id: new ObjectId(),
        //         subject: i,
        //         title: i,
        //         description: "A new user submitted a rating to your recipe odin",
        //         userId: new ObjectId("68c2dfc0f1943702bda209f5"),
        //         isRead: false,
        //         link: "/OdinProject/recipes/68c2e03ff1943702bda20aab#ratings"
        //     });
        // }

        const inserted = await this.model.find({});

        for (let i = 0; i < inserted.length; i++) {
            const today = new Date();
            const futureDate = new Date(today);
            futureDate.setDate(today.getDate() + i);

            const newDate = futureDate;
            const res = await this.model.updateOne(
                { _id: inserted[i]._id },
                { $set: { createdAt: newDate, updatedAt: newDate } },
                { timestamps: false }
            );
        }
    }
}

export default NotificationService;
