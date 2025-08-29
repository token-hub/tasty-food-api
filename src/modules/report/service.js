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

        if (data.userId) {
            data.userId = new ObjectId(data.userId);
        }

        if (data.pagination) {
            this.paginationData = data.pagination;
            delete data.pagination;
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

    getReportByReporterId(recipeId, reporterId) {
        if (!reporterId || !recipeId) {
            throw new Error("reporter/recipe id is missing");
        }

        const query = { "reporter.reporterId": reporterId };
        return this.model.findOne(query).lean();
    }

    getReportsQuery(data) {
        const query = {
            recipeId: data.recipeId,
            userId: data.userId
        };

        if (this.paginationData.cursor) {
            query.updatedAt = { $lt: new Date(this.paginationData.cursor) };
        }

        return query;
    }

    async getReports(data) {
        // add validation
        this.transformData(data);

        const query = this.getReportsQuery(data);
        const { sortBy, order, limit } = this.paginationData;
        return this.model
            .find(query)
            .sort({ [sortBy]: order })
            .limit(limit);
    }
}

export default ReportService;
