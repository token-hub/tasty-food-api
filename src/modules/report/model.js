import mongoose, { Schema } from "mongoose";

const ReportSchema = new Schema(
    {
        recipeId: { type: Schema.Types.ObjectId, required: true },
        subject: { type: String, required: true },
        report: { type: String, required: true },
        reporter: {
            reporterId: { type: Schema.Types.ObjectId, required: true },
            name: { type: String, required: true }
        },
        userId: { type: Schema.Types.ObjectId, required: true }
    },
    { timestamps: true }
);

ReportSchema.index({ recipeId: -1, userId: -1, updatedAt: -1 });

const ReportModel = mongoose.model("Report", ReportSchema);

export default ReportModel;
