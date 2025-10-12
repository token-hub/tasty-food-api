import express from "express";
import cors from "cors";
import { createServer } from "http";

// utils
import "./utils/db/db.js";
import "./utils/db/mongoose.js";

import { errorHandler } from "./middlewares/errors/errorHandler.js";
import { multipleErrorsHandler } from "./middlewares/errors/multipleErrorsHandler.js";
import { logErrors } from "./middlewares/errors/logErrors.js";
import Socket from "./modules/socket/socket.js";

import recipeRoutes from "./modules/recipe/index.js";
import ratingRoutes from "./modules/rating/index.js";
import conversationRoutes from "./modules/conversation/index.js";
import messageRoutes from "./modules/message/index.js";
import notificationRoutes from "./modules/notification/index.js";
import reportRoutes from "./modules/report/index.js";
import userRoutes from "./modules/user/index.js";
import authRoutes from "./modules/auth/index.js";

const app = express();
const httpServer = createServer(app);

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true
    })
);

// Socket.io
export const socket = new Socket(httpServer);

// routes
app.use("/api/recipes", recipeRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.use(logErrors);
app.use(multipleErrorsHandler);
app.use(errorHandler);

export default httpServer;
