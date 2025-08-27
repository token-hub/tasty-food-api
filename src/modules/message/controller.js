import MessageService from "./service.js";

class MessageController {
    #service;

    constructor() {
        this.#service = new MessageService();
    }

    get service() {
        return this.#service;
    }

    getMessages = async (req, res, next) => {
        try {
            const data = req.body;
            const messages = await this.service.getMessages(data);

            return res.status(200).json({
                status: "Success",
                details: messages
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new MessageController();
