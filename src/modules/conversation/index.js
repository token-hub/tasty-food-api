import express from "express";
const router = express.Router();
import ConversationController from "./controller.js";

router.post("/", ConversationController.createConversation);
router.post("/getConversations", ConversationController.getConversations);
router.put("/:conversationId", ConversationController.updateConvoRecipeAndMessages);
router.put("/:conversationId/markUnreadMessages", ConversationController.markUnreadMessages);

export default router;
