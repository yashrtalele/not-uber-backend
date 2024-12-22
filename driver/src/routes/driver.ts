import express, { Request, Response, Router } from "express";
import { HTTP_STATUS } from "../utils/constants";
import { createDriver } from "../prisma/queries/createDriver";
import { getDriverByPhoneNumber } from "../prisma/queries/getDriverByPhoneNumber";
import { DriverSignUpSchema } from "../schemas/driver.signup.schema";
import { DriverSignInSchema } from "../schemas/driver.signin.schema";
import { hashPassword, validatePassword } from "../services/passwordService";
import jwt from "jsonwebtoken";
import { blacklistToken } from "../prisma/queries/blacklistTokens";
import { driverAuth } from "../middleware/driverAuth";
import { AuthRequest } from "../utils/types";
import { getDriver } from "../prisma/queries/getDriver";
const JWT_SECRET = process.env.JWT_SECRET;
const router: Router = express.Router();

router.get("/", (req: Request, res: Response): void => {
  res.send("Driver service is up and running! 🚀");
  return;
});

router.post("/signup", async (req: Request, res: Response): Promise<void> => {
  const { success } = DriverSignUpSchema.safeParse(req.body);
  if (!success) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Invalid request body",
    });
    return;
  }
  const {
    password,
    phoneNumber,
    firstName,
    lastName,
    email,
    brand,
    model,
    vehicleType,
    capacity,
    color,
    licensePlate,
  } = req.body;
  const hashedPassword = await hashPassword(password);
  try {
    const dr = await getDriver(phoneNumber);
    if (dr === null) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Driver already exists",
      });
      return;
    }
    const { driver, driverProfile, vehicle } = await createDriver(
      email,
      hashedPassword,
      phoneNumber,
      firstName,
      lastName,
      brand,
      model,
      capacity,
      color,
      vehicleType,
      licensePlate
    );
    if (driver !== null) {
      const driverId: number = driver.id;
      const token = jwt.sign({ driverId }, JWT_SECRET as string, {
        expiresIn: "1h",
      });
      res.cookie("token", token);
      res.status(HTTP_STATUS.CREATED).json({
        message: "Driver created successfully",
        token: token,
        driver,
        driverProfile,
        vehicle,
      });
      return;
    } else {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Driver creation failed",
      });
      return;
    }
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: (error as Error).message,
    });
    return;
  }
});

router.post("/signin", async (req: Request, res: Response): Promise<void> => {
  const { success } = DriverSignInSchema.safeParse(req.body);
  if (!success) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Invalid request body",
    });
    return;
  }
  const { phoneNumber, password } = req.body;
  try {
    const { driver, driverProfile, vehicle } = await getDriverByPhoneNumber(phoneNumber);
    if (driver === null) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: "Driver does not exist",
      });
      return;
    }
    const isValidPassword = await validatePassword(password, driver.password);
    if (!isValidPassword) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: "Invalid password",
      });
      return;
    }
    const driverId: number = driver.id;

    const token = jwt.sign({ driverId }, JWT_SECRET as string, {
      expiresIn: "1h",
    });
    res.cookie("token", token);

    res.status(HTTP_STATUS.OK).json({
      message: "Driver logged in successfully",
      token,
      driver,
      driverProfile,
      vehicle,
    });
    return;
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: (error as Error).message,
    });
    return;
  }
});

router.get("/signout", async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies.token;
    await blacklistToken(token);
    res.clearCookie("token");
    res.send({ message: "Driver logged out successfully!" });
    return;
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: (error as Error).message,
    });
    return;
  }
});

router.get("/getDriverDetails", driverAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.send(req.driver);
    return;
  } catch (error) {
    res.send(HTTP_STATUS.BAD_REQUEST).json({ error });
  }
});

router.post("/checkIfDriverExists", async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      res.status(HTTP_STATUS.BAD_REQUEST).send({
        message: "Phone number is required",
      });
      return;
    }

    const driver = await getDriverByPhoneNumber(phoneNumber);

    if (driver.driver) {
      res.status(HTTP_STATUS.OK).send({
        message: "Driver exists",
        found: true,
        driver,
      });
    } else {
      res.status(HTTP_STATUS.OK).send({
        message: "Driver not found",
        found: false,
      });
    }
  } catch (error) {
    console.error("Error checking if driver exists:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
      message: "An error occurred while checking driver",
    });
  }
});

export { router };
