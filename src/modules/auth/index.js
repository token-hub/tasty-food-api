import express from "express";
import AuthController from "./controller.js";
const router = express.Router();

router.post("/signUp", AuthController.signUp);
router.post("/login", AuthController.login);

export default router;
