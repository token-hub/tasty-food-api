import ReportService from "./service.js";

class ReportController {
    #service;

    constructor() {
        this.#service = new ReportService();
    }

    get service() {
        return this.#service;
    }

    createReport = async (req, res, next) => {
        try {
            const userData = req.body;
            const newReport = await this.service.createReport(userData);
            return res.status(200).json({
                status: "Success",
                details: newReport
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new ReportController();
