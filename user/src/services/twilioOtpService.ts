const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;

import twilio from "twilio";
import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../utils/constants";
const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
  lazyLoading: true,
});
const TWILIO_SERVICE_SID = process.env.TWILIO_SERVICE_SID as string;

const sendOtp = async (req: Request, res: Response, next: NextFunction) => {
  const { phoneNumber } = req.body;
  try {
    await twilioClient.verify.v2
      .services(TWILIO_SERVICE_SID)
      .verifications.create({
        to: phoneNumber,
        channel: "sms",
      })
      .then((response) => {
        res.status(HTTP_STATUS.OK).json({
          message: "OTP sent successfully!",
          data: response,
        });
      });

    next();
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: "An error occurred while sending the OTP.",
      error,
    });
  }
};

const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  const { phoneNumber, code } = req.body;
  try {
    await twilioClient.verify.v2
      .services(TWILIO_SERVICE_SID)
      .verificationChecks.create({
        to: phoneNumber,
        code,
      })
      .then((response) => {
        res.status(HTTP_STATUS.OK).json({
          message: "OTP verified successfully!",
          data: response,
        });
      });

    next();
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: "An error occurred while verifying the OTP.",
      error,
    });
  }
};

export { sendOtp, verifyOtp };
