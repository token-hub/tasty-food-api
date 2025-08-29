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

    createReport(data) {
        // add validation here
        this.transformData(data);

        // check first if the reporter already reported the recipe;

        return this.model.create(data);
    }
}

export default ReportService;
