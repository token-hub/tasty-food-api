import ConversationModel from "./model.js";
import { ObjectId } from "mongodb";
import MessageService from "../message/service.js";
import { sessionWrapper } from "../../utils/session.js";

class ConversationService {
    #model;
    #messageService;
    #pagination = {
        page: 1,
        cursor: "",
        limit: 6,
        sortBy: "updatedAt",
        order: -1
    };

    constructor() {
        this.#model = ConversationModel;
        this.#messageService = new MessageService();
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

    get messageService() {
        return this.#messageService;
    }

    transformData(data) {
        if (data.participants && data.participants.length) {
            data.participants = data.participants.map((p) => {
                return {
                    ...p,
                    userId: new ObjectId(p.userId)
                };
            });
        }

        if (data.recipe && data.recipe.recipeId) {
            data.recipe.recipeId = new ObjectId(data.recipe.recipeId);
        }

        if (data.author && data.author.authorId) {
            data.author.authorId = new ObjectId(data.author.authorId);
        }

        if (data.authorId) {
            data.authorId = new ObjectId(data.authorId);
        }

        if (data.inquirerId) {
            data.inquirerId = new ObjectId(data.inquirerId);
        }

        if (data.userId) {
            data.userId = new ObjectId(data.userId);
        }

        if (data.conversationId) {
            data.conversationId = new ObjectId(data.conversationId);
        }

        if (data.recipeId) {
            data.recipeId = new ObjectId(data.recipeId);
        }

        if (data.pagination) {
            this.paginationData = data.pagination;
            delete data.pagination;
        }
    }

    getConversation(data) {
        const participantsId = data.participants.map((p) => p.userId);

        return this.model
            .findOne({
                "participants.userId": {
                    $all: participantsId
                }
            })
            .lean();
    }

    async updateConvoRecipeAndMessages(data) {
        // add validation
        this.transformData(data);

        const conversation = await ConversationService.getConversationById(data.conversationId);

        if (!conversation) {
            throw new Error("Cannot find conversation");
        }

        const latestMessages = await this.messageService.getMessages({
            conversationId: data.conversationId,
            recipeId: data.recipeId,
            skipFirstConvoMessages: false
        });

        const updatedRecipes = conversation.recipes.map((recipe) => {
            if (recipe.recipeId.equals(data.recipeId)) {
                return {
                    ...recipe,
                    isLatest: true
                };
            } else {
                return {
                    ...recipe,
                    isLatest: false
                };
            }
        });

        const query = { $set: { recipes: updatedRecipes, messages: latestMessages } };
        return this.model.findOneAndUpdate({ _id: conversation._id }, query, { new: true });
    }

    updateConversationRecipeTopics(conversation, newRecipe) {
        const existingRecipeTopics = conversation.recipes.map((recipe) => {
            return {
                ...recipe,
                isLatest: false
            };
        });

        const newRecipeTopics = [...existingRecipeTopics, { ...newRecipe, isLatest: true }];
        return this.model.findOneAndUpdate({ _id: conversation._id }, { $set: { recipes: newRecipeTopics } }, { new: true });
    }

    async createConversation(data) {
        // add validation

        this.transformData(data);

        const conversation = await this.getConversation(data);

        if (!conversation) {
            data.recipes = [{ ...data.recipe, isLatest: true }];
            return this.model.create(data);
        }

        const recipeExists = conversation.recipes.some((recipe) => recipe.recipeId.equals(data.recipe.recipeId));
        if (recipeExists) return;

        return this.updateConversationRecipeTopics(conversation, data.recipe);
    }

    getConversationQuery(data) {
        const cursor = this.paginationData.cursor;
        let query = { "participants.userId": data.userId };
        if (cursor) {
            query.updatedAt = { $lt: new Date(cursor) };
        }

        return query;
    }

    async getConversations(data) {
        this.transformData(data);

        let query = this.getConversationQuery(data);

        const { sortBy, limit, skip, order } = this.paginationData;

        return this.model
            .find(query)
            .sort({ [sortBy]: order })
            .skip(skip)
            .limit(limit);
    }

    async markUnreadMessages(data) {
        this.transformData(data);

        const conversation = await ConversationService.getConversationById(data.conversationId, { messages: 1 });

        if (!conversation) {
            throw new Error("Conversation not found");
        }

        const messagesToUpdate = conversation.messages.filter((m) => {
            return !m.isReadBy.some((id) => {
                return id.equals(data.userId);
            });
        });

        if (messagesToUpdate.length < 1) {
            return "nothing to update";
        }

        const unreadToReadMessages = conversation.messages.map((m) => {
            if (!m.isReadBy.some((id) => id.equals(data.userId))) {
                m.isReadBy.push(data.userId);
                return m;
            } else {
                return m;
            }
        });

        await sessionWrapper(async (session) => {
            await this.model.updateOne(
                {
                    _id: data.conversationId
                },
                { $set: { messages: unreadToReadMessages } },
                { session }
            );
            await this.messageService.updateMessages(data, session);
        });

        return "success";
    }

    static getConversationById(conversationId, projection) {
        if (!conversationId) return;
        return ConversationModel.findOne(
            {
                _id: conversationId
            },
            projection
        ).lean();
    }

    static async updateConversationMessages({ conversationId, message, session, limit }) {
        if (!conversationId) return;

        const conversation = await ConversationModel.findOne({ _id: conversationId }).lean();

        if (!conversation) {
            throw new Error("Cannot find the conversation");
        }

        const messages = conversation.messages;
        const newMessages = [...messages, message];

        if (newMessages.length > limit) {
            newMessages.shift();
        }

        return ConversationModel.updateOne(
            {
                _id: conversationId
            },
            { $set: { messages: newMessages } },
            { session }
        );
    }
}

export default ConversationService;
