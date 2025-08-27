import MessageModel from "./model.js";
import { ObjectId } from "mongodb";
import ControllerService from "../conversation/service.js";

class MessageService {
    #model;

    constructor() {
        this.#model = MessageModel;
        this.controllerService = new ControllerService();
    }

    #pagination = {
        cursor: "",
        limit: 6,
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
            const lastMessageShowned = conversation.messages[conversation.messages.length - 1];
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
            .limit(limit)
            .explain();

        return explain;
    }
}

export default MessageService;
