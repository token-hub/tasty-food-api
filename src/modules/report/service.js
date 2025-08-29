import ReportModel from "./model.js";
import { ObjectId } from "mongodb";

class ReportService {
    #model;
    #pagination = {
        cursor: "",
        limit: 5,
        sortBy: "updatedAt",
        order: -1
    };

    constructor() {
        this.#model = ReportModel;
    }

    get model() {
        return this.#model;
    }

    set paginationData(data) {
        this.#pagination = { ...this.#pagination, ...data };
    }

    get paginationData() {
        return this.#pagination;
    }

    transformData(data) {
        if (data.recipeId) {
            data.recipeId = new ObjectId(data.recipeId);
        }

        if (data.reporter && data.reporter.reporterId) {
            data.reporter.reporterId = new ObjectId(data.reporter.reporterId);
        }
    }

    async createReport(data) {
        // add validation here
        this.transformData(data);

        // check first if the reporter already reported the recipe;
        const hasReport = await this.getReportByReporterId(data.recipeId, data.reporter.reporterId);

        if (hasReport) {
            return "You already reported this recipe, Thank you for reporting";
        }

        return this.model.create(data);
    }

    getReports(data) {
        this.transformData(data);
    }

    getReportByReporterId(recipeId, reporterId) {
        if (!reporterId || !recipeId) {
            throw new Error("reporter/recipe id is missing");
        }

        const query = { "reporter.reporterId": reporterId };
        return this.model.findOne(query).lean();
    }
}

export default ReportService;
