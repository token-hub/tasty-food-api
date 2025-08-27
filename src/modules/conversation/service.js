import ConversationModel from "./model.js";
import { ObjectId } from "mongodb";

class ConversationService {
    #model;
    #pagination = {
        cursor: "",
        limit: 6
    };

    constructor() {
        this.#model = ConversationModel;
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
        this.paginationData = data.pagination;
        delete data.pagination;

        let query = this.getConversationQuery(data);
        return await this.model.find(query).sort({ updatedAt: -1 }).limit(this.paginationData.limit);
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
            throw new Error("Cannot fine the conversation");
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
