import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema(
    {
        subject: { type: String, required: true },
        recipe: {
            name: { type: String },
            imageLink: { type: String }
        },
        title: { type: String, required: true },
        description: { type: String, required: true },
        userId: { type: Schema.Types.ObjectId, required: true },
        isRead: { type: Boolean, default: false },
        link: { type: String, required: true }
    },
    { timestamps: true }
);

// For "get all messages sorted by updatedAt"
NotificationSchema.index({ userId: -1, isRead: -1, updatedAt: -1 });

// For "get only unread messages"
NotificationSchema.index({ userId: -1, updatedAt: -1 });

const NotificationModel = mongoose.model("Notification", NotificationSchema);

export default NotificationModel;
