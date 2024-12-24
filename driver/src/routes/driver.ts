import express, { Request, Response, Router } from "express";
import { driverAuth } from "../middleware/driverAuth";
import { checkIfDriverExists, getDriverDetails, signIn, signOut, signUp } from "../controller/driverController";
const router: Router = express.Router();

router.get("/", (req: Request, res: Response): void => {
  res.send("Driver service is up and running! 🚀");
  return;
});

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/signout", signOut);
router.get("/getDriverDetails", driverAuth, getDriverDetails);
router.post("/checkIfDriverExists", checkIfDriverExists);

export { router };
