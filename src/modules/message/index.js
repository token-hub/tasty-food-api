import express from "express";
const router = express.Router();
import MessageController from "./controller.js";

router.get("/", MessageController.getMessages);
router.post("/", MessageController.createMessage);

export default router;
