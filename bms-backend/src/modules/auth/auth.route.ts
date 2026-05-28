
import express from "express";
import * as AuthController from './auth.controller';
import { login, logout } from "./auth.controller";

const router = express.Router();

router.post('/send-otp',AuthController.sendOtp);
router.post('/verify-otp',AuthController.verifyOTP);
router.post("/login", login);
router.post("/signup",AuthController.signup);

export default router;
