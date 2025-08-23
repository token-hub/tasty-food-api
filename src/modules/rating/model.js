import mongoose, { Schema } from "mongoose";

const RatingSchema = new Schema(
    {
        recipeId: { type: Schema.Types.ObjectId, required: true },
        comment: {
            type: String
        },
        rater: {
            raterId: { type: Schema.Types.ObjectId, required: true },
            name: { type: String, required: true }
        },
        rate: { type: Number, required: true },
        likes: [{ type: Schema.Types.ObjectId }]
    },
    { timestamps: true }
);

RatingSchema.index({ recipeId: -1, createdAt: -1, "rater.raterId": -1 });
RatingSchema.index({ updatedAt: -1 });

const RecipeModel = mongoose.model("Rating", RatingSchema);

export default RecipeModel;
