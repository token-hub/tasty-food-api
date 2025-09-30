import express from "express";
const router = express.Router();
import MessageController from "./controller.js";

router.post("/getMessages", MessageController.getMessages);
router.post("/", MessageController.createMessage);

export default router;
