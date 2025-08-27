import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, required: true },
        recipeId: { type: Schema.Types.ObjectId, required: true },
        conversationId: { type: Schema.Types.ObjectId, required: true },
        message: { type: String, required: true },
        isRead: { type: Boolean, default: false }
    },
    { timestamps: true }
);

MessageSchema.index({ conversationId: -1, recipeId: -1, updatedAt: -1 });

const MessageModel = mongoose.model("Message", MessageSchema);

export default MessageModel;
