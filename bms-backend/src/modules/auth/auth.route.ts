
import express from "express";
import * as AuthController from './auth.controller';

const router = express.Router();

router.post('/send-otp',AuthController.sendOtp);
router.post('/verify-otp',AuthController.verifyOTP);

export default router;
