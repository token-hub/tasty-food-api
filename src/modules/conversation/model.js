import mongoose, { Schema } from "mongoose";

const ConversationSchema = new Schema(
    {
        recipe: {
            recipeId: { type: Schema.Types.ObjectId, required: true },
            name: { type: String, required: true },
            imageLink: { type: String, required: true },
            isLatest: { type: Boolean, default: true }
        },
        author: {
            userId: { type: Schema.Types.ObjectId, required: true },
            name: { type: String, required: true }
        },
        inquirerId: { type: Schema.Types.ObjectId, requried: true },
        messages: [
            {
                messageId: { type: Schema.Types.ObjectId, required: true },
                message: { type: String, require: true },
                userId: { type: Schema.Types.ObjectId, required: true },
                recipeId: { type: Schema.Types.ObjectId, required: true },
                isRead: { type: Boolean, default: false }
            }
        ]
    },
    { timestamp: true }
);

ConversationSchema.index({ "recipe.recipeId": -1, "author.authorId": -1, inquirerId: -1 });

const ConversationModel = mongoose.model("Conversation", ConversationSchema);

export default ConversationModel;
