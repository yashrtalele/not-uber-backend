import { Router } from "express";
import { userAuth } from "../middleware/authMiddleware";
import {
  getAutoCompleteSuggestionsController,
  getCoordinatesController,
  getDistanceTimeController,
} from "../controller/mapController";

const router = Router();

router.get("/getCoordinates", userAuth, getCoordinatesController);
router.get("/getDistanceTime", userAuth, getDistanceTimeController);
router.get("/getAutoSuggestions", userAuth, getAutoCompleteSuggestionsController);

export { router };
