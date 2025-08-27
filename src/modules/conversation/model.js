import mongoose, { Schema } from "mongoose";

const ConversationSchema = new Schema(
    {
        recipes: [
            {
                recipeId: { type: Schema.Types.ObjectId, required: true },
                name: { type: String, required: true },
                imageLink: { type: String, required: true },
                isLatest: { type: Boolean, default: true }
            }
        ],
        participants: [
            {
                name: { type: String, required: true },
                userId: { type: Schema.Types.ObjectId, required: true }
            }
        ],
        messages: [
            {
                messageId: { type: Schema.Types.ObjectId, required: true },
                message: { type: String, required: true },
                userId: { type: Schema.Types.ObjectId, required: true },
                recipeId: { type: Schema.Types.ObjectId, required: true },
                isRead: { type: Boolean, default: false }
            }
        ]
    },
    { timestamps: true }
);

ConversationSchema.index({ "participants.userId": -1, updatedAt: -1 });

const ConversationModel = mongoose.model("Conversation", ConversationSchema);

export default ConversationModel;
