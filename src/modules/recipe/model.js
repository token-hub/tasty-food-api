import mongoose, { Schema } from "mongoose";

const RecipeSchema = new Schema({
    author: {
        name: {
            type: String,
            required: true
        },
        userId: { type: mongoose.Schema.Types.ObjectId, required: true }
    },
    ingredients: [
        {
            createdAt: Date,
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
            required: true
        },
        minutes: {
            type: Number,
            required: true
        }
    },
    cookTime: {
        hours: {
            type: Number,
            required: true
        },
        minutes: {
            type: Number,
            required: true
        }
    },
    name: {
        type: String,
        trim: true,
        lowercase: true
    },
    description: {
        type: String,
        trim: true
    },
    categories: [String],
    image: {
        name: String,
        size: String,
        link: String
    },
    video: {
        name: String,
        length: String,
        size: String,
        link: String
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
        default: 0
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
                type: Date,
                required: true
            }
        }
    ],
    createdAt: {
        type: Date,
        required: true
    }
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
});

RecipeSchema.index({ totalRatings: -1, createdAt: -1 });
RecipeSchema.index({ "author.userId": -1, createdAt: -1 });
RecipeSchema.index({ categories: -1 });

const RecipeModel = mongoose.model("Recipe", RecipeSchema);

export default RecipeModel;
