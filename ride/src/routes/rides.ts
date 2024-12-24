import express, { Request, Response } from "express";
import {
  acceptRideController,
  createRideController,
  endRideController,
  getFareController,
  getRideDetailsController,
  startRideController,
} from "../controller/rideController";
import { driverAuth, userAuth } from "../middleware/authMiddleware";
const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Ride service is up and running!");
});
router.post("/createRide", userAuth, createRideController);
router.put("/acceptRide", driverAuth, acceptRideController);
router.get("/getFare", userAuth, getFareController);
router.get("/startRide", driverAuth, startRideController);
router.post("/endRide", driverAuth, endRideController);
router.get("/getRideDetails", getRideDetailsController);

export { router };
