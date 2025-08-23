import express from "express";
import cors from "cors";

// utils
import "./utils/db/db.js";
import "./utils/db/mongoose.js";

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

export default app;
