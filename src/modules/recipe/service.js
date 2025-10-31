import RecipeModel from "./model.js";
import { ObjectId } from "mongodb";
import AuthService from "../auth/service.js";
import { faker } from "@faker-js/faker";

class RecipeService {
    #model;
    #authService;
    #pagination = {
        page: 1,
        cursor: "",
        limit: 6,
        sortBy: "updatedAt",
        order: -1,
    };

    constructor() {
        this.#model = RecipeModel;
        this.#authService = new AuthService();
        this.init();
    }

    get authService() {
        return this.#authService;
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

    async init() {
        const total = await this.getTotalRecipe();
        if (total < 2) {
            this.createDummyData(20);
        }
    }

    transformData(data) {
        if (data.recipeId) {
            data.recipeId = new ObjectId(data.recipeId);
        }

        if (data.author && data.author.userId) {
            data.author.userId = new ObjectId(data.author.userId);
        }

        if (data.authorId) {
            data.authorId = new ObjectId(data.authorId);
        }

        if (data.filters && typeof data.filters === "string") {
            data.filters = JSON.parse(data.filters);
        }
    }

    getQueryAllRecipes(data) {
        const { limit, cursor, page, order } = this.paginationData;

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

        let query = { isArchive: Boolean(data?.isArchive) };
        if (cursor) {
            query.updatedAt = { [order == -1 ? "$lt" : "$gt"]: new Date(cursor) };
        }

        if (data?.author) {
            query["author.userId"] = { $eq: data?.author?.userId };
        }

        if (data?.filters?.categories.length) {
            query.categories = { $in: data?.filters.categories };
        }

        if (data?.query) {
            query.name = { $regex: data?.query };
        }

        return { query, skip };
    }

    async getAllRecipes(data) {
        // add validation

        this.paginationData = data.pagination;
        delete data.pagination;

        this.transformData(data);

        const { query, skip } = this.getQueryAllRecipes(data);
        const { sortBy, limit, order, page } = this.paginationData;

        const recipes = await this.model
            .find(query, { author: 1, name: 1, image: 1, __v: -1 })
            .sort({ [sortBy]: order })
            .skip(skip)
            .collation(data?.query ? { locale: "en", strength: 2 } : undefined)
            .limit(limit);

        return {
            recipes,
            page,
        };
    }

    getTotalRecipe(data) {
        const query = {};
        if (data) {
            this.transformData(data);
            query.isArchive = data.isArchive;
            if (data.authorId) {
                query["author.userId"] = data.authorId;
            }
            if (data?.filters?.length) {
                query.categories = { $in: data.filters };
            }
            if (data?.query) {
                query.name = { $eq: data.query };
            }
        }

        return this.model.countDocuments(query);
    }

    getRecipe(data, projection = null) {
        if (!data.recipeId) {
            throw new Error("Recipe Id is missing");
        }
        this.transformData(data);
        const projectionToUse = projection ?? { totalRating: 0, isArchive: 0, __v: 0 };
        return this.model.findById({ _id: data.recipeId }, projectionToUse).lean();
    }

    createRecipe(data) {
        // implement business logic
        this.transformData(data);

        return this.model.create(data);
    }

    async isRecipeAuthor(recipeId, headers) {
        const session = await this.authService.getSession(headers);
        const recipe = await this.getRecipe({ recipeId });
        const isRecipeAuthor = recipe.author.userId.equals(session?.user?.id);

        if (!isRecipeAuthor) {
            throw new Error("Action forbidden");
        }
    }

    async updateRecipe(data, headers) {
        if (!data.recipeId) {
            throw new Error("Recipe Id is missing");
        }

        this.transformData(data);
        const recipeId = data.recipeId;
        await this.isRecipeAuthor(recipeId, headers);

        delete data.recipeId;

        return this.model.findByIdAndUpdate(
            { _id: recipeId },
            {
                $set: data,
            },
            {
                runValidators: true,
                returnDocument: "after",
            }
        );
    }

    async updateRecipeTopRatingsViaId(recipeId, data, session) {
        if (!recipeId) {
            throw new Error("Recipe Id is missing");
        }

        if (!data || (data && !Object.keys(data).length)) return;

        const options = { runValidators: true, returnDocument: "after" };
        if (session) {
            options.session = session;
        }

        return this.model.findByIdAndUpdate(
            { _id: recipeId },
            {
                $set: data,
            },
            {
                runValidators: true,
                returnDocument: "after",
                options,
            }
        );
    }

    async createDummyData(count = 10) {
        console.log("Creating dummy recipes");
        const data = [];
        const units = ["ounce/s", "piece/s", "liter/s"];
        const categories = ["fish", "pork", "beef", "chicken", "vegetable", "dessert"];

        function getIngredients() {
            const count = Math.floor(Math.random() * 10) + 1;
            let newIngredients = [];

            const ingredientsCount = Math.floor(Math.random() * count) + 1;

            for (let ii = 0; ii < ingredientsCount; ii++) {
                const ingredientToUse = faker.food.ingredient();
                const ingredientExist = newIngredients.some((ing) => ing.name === ingredientToUse);
                if (ingredientExist) continue;
                const unitToUse = units[faker.number.int({ min: 0, max: units.length - 1 })];
                const quantityToUse = faker.number.int({ min: 1, max: 10 });

                newIngredients.push({
                    name: ingredientToUse,
                    unit: unitToUse,
                    quantity: quantityToUse,
                });
            }
            return newIngredients;
        }
        function getInstructions() {
            const instructions = [];
            const instructionsCount = Math.floor(Math.random() * 10) + 1;
            for (let i = 0; i < instructionsCount; i++) {
                instructions.push({ id: faker.string.uuid(), instruction: faker.lorem.words(10) });
            }
            return instructions;
        }

        for (let i = 0; i < count; i++) {
            let recipe = {
                author: {
                    name: faker.person.firstName(),
                    userId: new ObjectId(),
                },
                ingredients: getIngredients(),
                instructions: getInstructions(),
                cookTime: {
                    hours: faker.number.int({ min: 0, max: 2 }),
                    minutes: faker.number.int({ min: 0, max: 60 }),
                },
                prepTime: {
                    hours: faker.number.int({ min: 0, max: 2 }),
                    minutes: faker.number.int({ min: 0, max: 60 }),
                },
                name: faker.food.dish(),
                description: faker.food.description(),
                categories: [categories[Math.floor(Math.random() * categories.length) + 1]],
                isDummy: true,
            };
            data.push(recipe);
        }

        try {
            await this.model.insertMany(data);
            console.log("Done creating dummy recipes");
        } catch (error) {
            console.log(error);
        }
    }
}

export default RecipeService;
