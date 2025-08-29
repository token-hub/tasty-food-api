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
            const data = req.body;
            const newReport = await this.service.createReport(data);
            return res.status(201).json({
                status: "Success",
                details: newReport
            });
        } catch (error) {
            next(error);
        }
    };

    getReports = async (req, res, next) => {
        try {
            const data = req.body;
            const reports = await this.service.getReports(data);
            return res.status(200).json({
                status: "Success",
                details: reports
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new ReportController();
