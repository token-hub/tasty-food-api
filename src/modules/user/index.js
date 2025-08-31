import express from "express";
import UserController from "./controller.js";

const router = express.Router();

router.post("/", UserController.createUser);
router.put("/:userId", UserController.updateUser);

export default router;
