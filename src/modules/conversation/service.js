import ConversationModel from "./model.js";
import { ObjectId } from "mongodb";

class ConversationService {
    #model;

    constructor() {
        this.#model = ConversationModel;
    }

    get model() {
        return this.#model;
    }

    transformData(data) {
        if (data.recipe && data.recipe.recipeId) {
            data.recipe.recipeId = new ObjectId(data.recipe.recipeId);
        }

        if (data.author && data.author.authorId) {
            data.author.authorId = new ObjectId(data.author.authorId);
        }

        if (data.inquirerId) {
            data.inquirerId = new ObjectId(data.inquirerId);
        }
    }

    getConversation(data) {
        return this.model
            .findOne({
                inquirerId: data.inquirerId,
                "author.authorId": data.author.authorId
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
}

export default ConversationService;
