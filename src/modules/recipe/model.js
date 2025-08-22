import mongoose, { Schema } from "mongoose";

const RecipeSchema = new Schema(
    {
        author: {
            name: {
                type: String,
                required: true
            },
            userId: { type: mongoose.Schema.Types.ObjectId, required: true }
        },
        ingredients: [
            {
                name: {
                    type: String,
                    trim: true,
                    lowercase: true,
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                },
                unit: {
                    type: String,
                    required: true
                },
                isMain: {
                    type: Boolean,
                    default: false
                }
            }
        ],
        prepTime: {
            hours: {
                type: Number,
                default: 0
            },
            minutes: {
                type: Number,
                required: true
            }
        },
        cookTime: {
            hours: {
                type: Number,
                default: 0
            },
            minutes: {
                type: Number,
                required: true
            }
        },
        name: {
            type: String,
            trim: true,
            lowercase: true,
            required: true
        },
        description: {
            type: String,
            trim: true,
            required: true
        },
        categories: [String],
        image: {
            type: {
                name: { type: String, required: true },
                size: { type: String, required: true },
                link: { type: String, required: true }
            },
            default: null
        },
        video: {
            type: {
                name: { type: String, required: true },
                length: { type: String, required: true },
                size: { type: String, required: true },
                link: { type: String, required: true }
            },
            default: null
        },
        totalRatings: {
            type: Number,
            default: 0
        },
        numberOfRatings: {
            type: Number,
            default: 0
        },
        isArchive: {
            type: Boolean,
            default: false
        },
        goodForPeopleCount: {
            type: Number,
            default: 1
        },
        topFiveRecentRatings: [
            {
                ratingsId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true
                },
                comment: {
                    type: String,
                    trim: true,
                    required: true
                },
                rating: {
                    type: Number,
                    default: 0
                },
                rater: {
                    raterId: {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true
                    },
                    name: {
                        type: String,
                        required: true
                    }
                },
                likes: [mongoose.Schema.Types.ObjectId],
                createdAt: {
                    type: Number,
                    default: Date.now,
                    required: true
                }
            }
        ]
        // topRatedIndex: {
        //     type: String,
        //     index: true,
        //     unique: true,
        //     required: true
        // },
        // categoriesIndex: {
        //     type: String,
        //     index: true,
        //     unique: true,
        //     required: true
        // },
        // ownRecipeIndex: {
        //     type: String,
        //     index: true,
        //     unique: true,
        //     required: true
        // }
    },
    { timestamps: true }
);

RecipeSchema.index({ totalRatings: -1, createdAt: -1 });
RecipeSchema.index({ "author.userId": -1, createdAt: -1 });
RecipeSchema.index({ categories: -1 });
RecipeSchema.index({ updatedAt: -1 });

const RecipeModel = mongoose.model("Recipe", RecipeSchema);

export default RecipeModel;
