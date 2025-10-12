import { sessionWrapper } from "../../utils/session.js";
import RatingModel from "./model.js";
import RecipeService from "../recipe/service.js";
import NotificationService from "../notification/service.js";
import { NOTIFICATION_TYPES } from "../../utils/notifications.js";

import { ObjectId } from "mongodb";

class RatingService {
    #model;
    #recipeService;
    #NotificationService;
    #recentRatingsLimit = 5;
    #pagination = {
        page: 1,
        cursor: "",
        limit: 6,
        sortBy: "updatedAt",
        order: -1
    };

    constructor() {
        this.#model = RatingModel;
        this.#recipeService = new RecipeService();
        this.#NotificationService = new NotificationService();
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

    get recipeService() {
        return this.#recipeService;
    }

    get notificationService() {
        return this.#NotificationService;
    }

    transformData(data) {
        if (data.recipeId) {
            data.recipeId = new ObjectId(data.recipeId);
        }

        if (data?.rater?.raterId) {
            data.rater.raterId = new ObjectId(data.rater.raterId);
        }

        if (data.raterId) {
            data.raterId = new ObjectId(data.raterId);
        }

        if (data.ratingId) {
            data.ratingId = new ObjectId(data.ratingId);
        }

        if (data.likerId) {
            data.likerId = new ObjectId(data.likerId);
        }

        if (data.pagination) {
            this.paginationData = data.pagination;
            delete data.pagination;
        }

        return data;
    }

    getQueryAllRating(data) {
        let query = { recipeId: data.recipeId };
        const { limit, page, cursor, order } = this.paginationData;

        let defaultSkip = limit * (page - 1);
        let isNotFirstPage = defaultSkip > 0;
        let skip = isNotFirstPage ? defaultSkip : 0;

        if (order == 1) {
            // need to skip 1 if user wants to be previous page due to using $gte
            // it will match the first data of the current page
            // and we want to skip that so that all the data from the previous
            // page will correctly be fetch
            let isSkipPositive = skip - 1 > 0;
            skip = isSkipPositive ? skip - 1 : 1;
        }

        if (cursor) {
            query.updatedAt = { [order == -1 ? "$lte" : "$gte"]: new Date(cursor) };
        }

        return { query, skip };
    }

    createRating(data) {
        // add validation

        if (data.rate < 4 && !data.comment) {
            throw new Error("Please add a comment");
        }

        if (!data) {
            throw new Error("Missing required Data");
        }

        data = this.transformData(data);

        // notify the author here

        return sessionWrapper(async (session) => {
            const recipe = await this.recipeService.getRecipe({ recipeId: data.recipeId }, { topFiveRecentRatings: 1, image: 1, name: 1, author: 1 });

            if (!recipe) {
                throw new Error("Cannot find the recipe");
            }

            this.model.updateMany({ userId: data.userId, isRead: false }, { $set: { isRead: true } }, { session });

            const result = await this.model.findOneAndUpdate(
                { recipeId: data.recipeId, "rater.raterId": data.rater.raterId },
                { $set: data },
                { upsert: true, new: true, session }
            );

            const alreadyRated = recipe.topFiveRecentRatings.some((rating) => data.rater.raterId.equals(rating.rater.raterId));
            const topFiveRecentRatings = recipe.topFiveRecentRatings;
            let newTopFiveRecentRatings;
            const newRating = {
                ratingsId: result._id,
                comment: result.comment,
                rate: result.rate,
                rater: result.rater,
                likes: result.likes,
                createdAt: result.createdAt
            };

            if (alreadyRated) {
                newTopFiveRecentRatings = [...topFiveRecentRatings].map((rating) => {
                    if (data.rater.raterId.equals(rating.rater.raterId)) {
                        return {
                            ...rating,
                            ...newRating
                        };
                    } else {
                        return rating;
                    }
                });
            } else {
                newTopFiveRecentRatings = [...topFiveRecentRatings, newRating];
                if (newTopFiveRecentRatings.length > this.#recentRatingsLimit) {
                    newTopFiveRecentRatings.shift();
                }
            }

            await this.recipeService.updateRecipeTopRatingsViaId(data.recipeId, { topFiveRecentRatings: newTopFiveRecentRatings }, session);

            const notification = NOTIFICATION_TYPES[0];

            // create notification for the user here
            await this.notificationService.createNotification({
                subject: notification.subject,
                recipe: {
                    name: recipe?.image?.type.name,
                    imageLink: recipe?.image?.type.link
                },
                title: notification.title,
                description: `${notification.description} ${recipe.name}`,
                userId: recipe.author.userId,
                link: `/recipes/${recipe._id}#ratings`
            });

            return result;
        });
    }

    async getAllRating(data) {
        // add validation
        // recipe Id should always be present

        this.transformData(data);
        const { query, skip } = this.getQueryAllRating(data);
        const { sortBy, order, limit, page } = this.paginationData;

        const ratings = await this.model
            .find(query)
            .skip(skip)
            .sort({ [sortBy]: order })
            .limit(limit);

        return {
            ratings,
            page
        };
    }

    async getRating(data) {
        // add validation for data.raterId and data.recipeId
        data = this.transformData(data);

        return await this.model.findOne({ recipeId: data.recipeId, "rater.raterId": data.raterId });
    }

    async likeUnlikeRating(data) {
        // add validation for data.likerId and data.ratingId and recipeId
        this.transformData(data);
        let isTopRating = data?.isTopRating ?? true;
        const rating = await this.model.findOne({ _id: data.ratingId }).lean();

        if (!rating) {
            throw new Error("Cannot find the rating");
        }

        if (isTopRating) {
            const recipe = await this.recipeService.getRecipe({ recipeId: data.recipeId }, { _id: 1, topFiveRecentRatings: 1 });

            if (!recipe) {
                throw new Error("Cannot find the recipe");
            }

            const newLikes = rating.likes.some((id) => id.equals(data.likerId))
                ? rating.likes.filter((id) => !id.equals(data.likerId))
                : [...rating.likes, data.likerId];

            const newTopFiveRecentRatings = recipe.topFiveRecentRatings.map((topRating) => {
                if (topRating.ratingsId.equals(data.ratingId)) {
                    return { ...topRating, likes: newLikes };
                } else {
                    return topRating;
                }
            });

            await this.recipeService.updateRecipeTopRatingsViaId(data.recipeId, { topFiveRecentRatings: newTopFiveRecentRatings });
        }

        let update;
        const hasAlreadyLiked = rating.likes.some((id) => id.equals(data.likerId));

        if (hasAlreadyLiked) {
            update = { $pull: { likes: data.likerId } };
        } else {
            update = { $addToSet: { likes: data.likerId } };
        }

        return this.model
            .findOneAndUpdate({ _id: rating._id }, update, {
                new: true
            })
            .select("likes");
    }

    getRatingsTotalCount(data) {
        const query = {};
        if (data) {
            this.transformData(data);

            if (data.recipeId) {
                query.recipeId = data.recipeId;
            }
        }

        return this.model.countDocuments(query);
    }
}

export default RatingService;
