import express from "express";
import AuthController from "./controller.js";
const router = express.Router();

router.post("/signUp", AuthController.signUp);
router.post("/signIn", AuthController.signIn);
router.post("/signOut", AuthController.signOut);
router.post("/sendEmailVerification", AuthController.sendEmailVerification);
router.get("/verify-email", AuthController.verifyEmail);
router.post("/request-reset-password", AuthController.requestPasswordReset);
router.post("/reset-password", AuthController.passwordReset);
router.get("/getSession", AuthController.getSession);

export default router;
