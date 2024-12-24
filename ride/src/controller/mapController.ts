import { Request, Response } from "express";
import { getAddressCoordinate, getAutoCompleteSuggestions, getDistanceTime } from "../services/mapService";
import { GetAutoCompleteSuggestionsSchema } from "../schemas/map.getAutoCompleteSuggestions.schema";
import { HTTP_STATUS } from "../utils/constants";
import { GetDistanceTimeSchema } from "../schemas/map.getDistanceTime.schema";
import { GetCoordinatesSchema } from "../schemas/map.getCoordinates.schema";

const getCoordinatesController = async (req: Request, res: Response): Promise<void> => {
  const { success } = GetCoordinatesSchema.safeParse(req.body);
  if (!success) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Invalid request body",
    });
    return;
  }
  const { address } = req.body;
  try {
    const coordinates = await getAddressCoordinate(address);
    res.status(HTTP_STATUS.OK).json(coordinates);
    return;
  } catch (error) {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      message: "Coordinates not found",
      error: (error as Error).message,
    });
    return;
  }
};

const getDistanceTimeController = async (req: Request, res: Response) => {
  try {
    const success = GetDistanceTimeSchema.safeParse(req.body);
    if (!success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Invalid request body",
      });
      return;
    }

    const { current, destination } = req.body;

    const distanceTime = await getDistanceTime(current, destination);
    res.status(HTTP_STATUS.OK).json(distanceTime);
    return;
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: (error as Error).message,
    });
    return;
  }
};

const getAutoCompleteSuggestionsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { success } = GetAutoCompleteSuggestionsSchema.safeParse(req.body);
    if (!success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Invalid request body",
      });
      return;
    }
    const { input } = req.body;
    const suggestions = await getAutoCompleteSuggestions(input);
    res.status(HTTP_STATUS.OK).json(suggestions);
    return;
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: (error as Error).message,
    });
    return;
  }
};

export { getAutoCompleteSuggestionsController, getCoordinatesController, getDistanceTimeController };
