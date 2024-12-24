import { Request, Response } from "express";
import { CreateRideSchema } from "../schemas/ride.createRide.schema";
import { AcceptRideSchema } from "../schemas/ride.acceptRide.schema";
import { createRide } from "../prisma/queries/createRide";
import { acceptRide } from "../prisma/queries/acceptRide";
import { HTTP_STATUS } from "../utils/constants";
import { GetFareSchema } from "../schemas/ride.getFare.schema";
import { endRideService, getFare, startRideService } from "../services/rideService";
import { EndRideSchema } from "../schemas/ride.endRide.schema";
import { StartRideSchema } from "../schemas/ride.startRide.schema";
import { AcceptRideAuthRequest, CreateRideAuthRequest, EndRideAuthRequest, StartRideAuthRequest } from "../utils/types";
import { getRideDetails } from "../prisma/queries/getRideDetails";
import { GetRideDetailsSchema } from "../schemas/ride.getRideDetails.schema";

const createRideController = async (req: CreateRideAuthRequest, res: Response): Promise<void> => {
  try {
    const { success } = CreateRideSchema.safeParse(req.body);
    if (!success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Invalid request body",
      });
      return;
    }
    const { pickup, destination, vehicleType } = req.body;

    const ride = await createRide(req.user?.id as number, pickup, destination, vehicleType);
    res.status(HTTP_STATUS.CREATED).json(ride);
    return;
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: (error as Error).message,
    });
    return;
  }
};

const acceptRideController = async (req: AcceptRideAuthRequest, res: Response): Promise<void> => {
  try {
    const { success } = AcceptRideSchema.safeParse(req.body);
    if (!success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Invalid request body",
      });
      return;
    }
    const { rideId } = req.body;

    const ride = await acceptRide(rideId, req.driver?.id as number);
    res.status(HTTP_STATUS.OK).json(ride);
    return;
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: (error as Error).message,
    });
    return;
  }
};

const getFareController = async (req: Request, res: Response): Promise<void> => {
  const { success } = GetFareSchema.safeParse(req.body);
  if (!success) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Invalid request body",
    });
    return;
  }

  const { current, destination } = req.body;

  try {
    const fare = await getFare(current, destination);
    res.status(HTTP_STATUS.OK).json(fare);
    return;
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: (error as Error).message,
    });
    return;
  }
};

const startRideController = async (req: StartRideAuthRequest, res: Response): Promise<void> => {
  const { success } = StartRideSchema.safeParse(req.body);
  if (!success) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Invalid request body",
    });
    return;
  }

  const { rideId, otp } = req.body;

  try {
    const ride = await startRideService(rideId, otp, req.driver?.id as number);

    console.log(ride);

    // sendMessageToSocketId(ride.user.socketId, {
    //   event: "ride-started",
    //   data: ride,
    // });

    res.status(HTTP_STATUS.OK).json(ride);
    return;
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: (error as Error).message,
    });
    return;
  }
};

const endRideController = async (req: EndRideAuthRequest, res: Response): Promise<void> => {
  const { success } = EndRideSchema.safeParse(req.body);
  if (!success) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Invalid request body",
    });
    return;
  }

  const { rideId } = req.body;

  try {
    const ride = await endRideService(rideId, req.driver?.id as number);

    // sendMessageToSocketId(ride.user.socketId, {
    //   event: "ride-ended",
    //   data: ride,
    // });

    res.status(HTTP_STATUS.OK).json(ride);
    return;
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: (error as Error).message,
    });
    return;
  }
};

const getRideDetailsController = async (req: Request, res: Response): Promise<void> => {
  const { success } = GetRideDetailsSchema.safeParse(req.body);
  if (!success) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Invalid request body",
    });
    return;
  }

  const { rideId } = req.body;

  try {
    const ride = await getRideDetails(rideId);
    res.status(HTTP_STATUS.OK).json(ride);
    return;
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: (error as Error).message,
    });
    return;
  }
};

export {
  acceptRideController,
  createRideController,
  endRideController,
  getFareController,
  getRideDetailsController,
  startRideController,
};
