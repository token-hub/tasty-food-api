import express from "express";
import cors from "cors";

// utils
import "./utils/db/db.js";
import "./utils/db/mongoose.js";

import recipeRoutes from "./modules/recipe/index.js";

const app = express();
const router = express.Router();

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// routes
app.use("/api/recipes", () => recipeRoutes(router));

export default app;
