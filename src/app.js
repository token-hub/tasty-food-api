import express from "express";
import cors from "cors";

// utils
import "./utils/db/db.js";
import "./utils/db/mongoose.js";

import { errorHandler } from "./middlewares/errors/errorHandler.js";
import { multipleErrorsHandler } from "./middlewares/errors/multipleErrorsHandler.js";
import { logErrors } from "./middlewares/errors/logErrors.js";

import recipeRoutes from "./modules/recipe/index.js";
import ratingRoutes from "./modules/rating/index.js";

const app = express();

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// routes
app.use("/api/recipes", recipeRoutes);
app.use("/api/ratings", ratingRoutes);

app.use(logErrors);
app.use(multipleErrorsHandler);
app.use(errorHandler);

export default app;
