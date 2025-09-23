import express from "express";
const router = express.Router();
import ConversationController from "./controller.js";

router.post("/", ConversationController.createConversation);
router.post("/getConversations", ConversationController.getConversations);
router.put("/:conversationId", ConversationController.updateConvoRecipeAndMessages);

export default router;
