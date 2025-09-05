import express from "express";
import AuthController from "./controller.js";
const router = express.Router();

router.post("/signUp", AuthController.signUp);
router.post("/signIn", AuthController.signIn);
router.post("/signOut", AuthController.signOut);
router.post("/sendEmailVerification", AuthController.sendEmailVerification);
router.get("/verifyEmail", AuthController.verifyEmail);
router.post("/requestResetPassword", AuthController.requestPasswordReset);
router.post("/resetPassword", AuthController.passwordReset);
router.post("/changePassword", AuthController.changePassword);
router.get("/getSession", AuthController.getSession);

export default router;
