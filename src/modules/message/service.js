import MessageModel from "./model.js";
import { ObjectId } from "mongodb";
import ControllerService from "../conversation/service.js";
import { sessionWrapper } from "../../utils/session.js";
import mongoose from "mongoose";

class MessageService {
    #model;

    constructor() {
        this.#model = MessageModel;
    }

    #pagination = {
        cursor: "",
        limit: 5,
        sortBy: "updatedAt",
        order: -1
    };

    get model() {
        return this.#model;
    }

    transformData(data) {
        if (data.conversationId) {
            data.conversationId = new ObjectId(data.conversationId);
        }

        if (data.recipeId) {
            data.recipeId = new ObjectId(data.recipeId);
        }

        if (data.userId) {
            data.userId = new ObjectId(data.userId);
        }

        if (data.isReadBy && data.isReadBy.length) {
            data.isReadBy = data.isReadBy.map((id) => new ObjectId(id));
        }

        if (data.pagination) {
            this.paginationData = data.pagination;
            delete data.pagination;
        }
    }

    set paginationData(data) {
        this.#pagination = { ...this.#pagination, ...data };
    }

    get paginationData() {
        return this.#pagination;
    }

    async getMessagesQuery(data) {
        if (data.skipFirstConvoMessages) {
            const conversation = await ControllerService.getConversationById(data.conversationId, { messages: 1, _id: 0 });

            if (!conversation) {
                throw new Error("Cannot find conversation");
            }

            if (conversation.messages.length) {
                const lastMessageShowned = conversation.messages[0];
                if (this.paginationData.cursor === "") {
                    this.paginationData.cursor = lastMessageShowned.updatedAt;
                }
            }
        }

        const query = {
            conversationId: data.conversationId,
            recipeId: data.recipeId
        };

        if (this.paginationData.cursor) {
            query.updatedAt = { $lt: new Date(this.paginationData.cursor) };
        }

        return query;
    }

    async getMessages(data) {
        // add validation
        this.transformData(data);

        const query = await this.getMessagesQuery(data);
        const { sortBy, order, limit } = this.paginationData;

        const result = await this.model
            .find(query)
            .sort({ [sortBy]: Number(order) })
            .limit(limit);

        return result;
    }

    async createMessage(data) {
        this.transformData(data);

        return sessionWrapper(async (session) => {
            const message = await this.model.create([data], { session });
            await ControllerService.updateConversationMessages({
                conversationId: data.conversationId,
                message: {
                    messageId: message[0]._id,
                    message: data.message,
                    userId: data.userId,
                    recipeId: data.recipeId,
                    isReadBy: data.isReadBy,
                    updatedAt: message[0].updatedAt.toISOString()
                },
                limit: this.paginationData.limit,
                session
            });

            return message;
        });
    }

    updateMessages(data, session) {
        if (!data.conversationId) {
            throw new Error("ConversationId must not be empty");
        }

        if (!data.userId) {
            throw new Error("userId must not be empty");
        }

        return this.model.updateMany(
            { conversationId: data.conversationId, isReadBy: { $ne: data.userId } },
            {
                $push: { isReadBy: data.userId }
            },
            { session }
        );
    }
}

export default MessageService;
