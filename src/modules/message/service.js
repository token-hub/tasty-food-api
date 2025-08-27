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
    }

    set paginationData(data) {
        this.#pagination = { ...this.#pagination, ...data };
    }

    get paginationData() {
        return this.#pagination;
    }

    async getMessagesQuery(data) {
        const conversation = await ControllerService.getConversationById(data.conversationId, { messages: 1, _id: 0 });

        if (!conversation) {
            throw new Error("Cannot find conversation");
        }

        if (conversation.messages.length) {
            const lastMessageShowned = conversation.messages[0];
            this.paginationData = { cursor: new Date(lastMessageShowned.updatedAt) };
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
        const explain = await this.model
            .find(query)
            .sort({ [sortBy]: order })
            .limit(limit);
        return explain;
    }

    async createMessage(data) {
        this.transformData(data);

        return sessionWrapper(async (session) => {
            const message = await this.model.create([data], { session });
            await ControllerService.updateConversationMessages(
                data.conversationId,
                {
                    messageId: message[0]._id,
                    message: data.message,
                    userId: data.userId,
                    recipeId: data.recipeId,
                    isRead: false,
                    updatedAt: message[0].updatedAt.toISOString()
                },
                session
            );

            return message;
        });
    }
}

export default MessageService;
