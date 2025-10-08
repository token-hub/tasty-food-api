import ConversationService from "./service.js";

class ConversationController {
    #service;

    constructor() {
        this.#service = new ConversationService();
    }

    get service() {
        return this.#service;
    }

    createConversation = async (req, res, next) => {
        try {
            const data = req.body;
            const conversation = await this.service.createConversation(data);

            return res.status(201).json({
                status: "Success",
                details: conversation
            });
        } catch (error) {
            next(error);
        }
    };

    getConversations = async (req, res, next) => {
        try {
            const data = req.body;
            const conversations = await this.service.getConversations(data);
            return res.status(200).json({
                status: "Success",
                details: conversations
            });
        } catch (error) {
            next(error);
        }
    };

    updateConvoRecipeAndMessages = async (req, res, next) => {
        try {
            const data = req.body;
            data.conversationId = req.params.conversationId;
            const conversation = await this.service.updateConvoRecipeAndMessages(data);
            return res.status(200).json({
                status: "Success",
                details: conversation
            });
        } catch (error) {
            next(error);
        }
    };

    markUnreadMessages = async (req, res, next) => {
        try {
            const data = req.body;
            data.conversationId = req.params.conversationId;
            const conversation = await this.service.markUnreadMessages(data);
            return res.status(200).json({
                status: "Success",
                details: conversation
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new ConversationController();
