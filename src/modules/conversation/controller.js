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
}

export default new ConversationController();
