import express, { Router } from "express";
import { sendOtp, verifyOtp } from "../services/twilioOtpService";

const router: Router = express.Router();

router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyOtp);

export { router };
