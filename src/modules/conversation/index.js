import express from "express";
const router = express.Router();
import ConversationController from "./controller.js";

router.post("/", ConversationController.createConversation);

export default router;
