import jwt from "jsonwebtoken";
import { NextFunction, Response } from "express";
import axios from "axios";
import { DriverAuthRequest, UserAuthRequest } from "../utils/types";
const JWT_SECRET = process.env.JWT_SECRET;
interface Driver {
  id: number;
  email: string;
  phoneNumber: string;
}

interface DriverProfile {
  id: number;
  firstName: string;
  lastName: string;
}

interface Vehicle {
  id: number;
  brand: string;
  model: string;
  capacity: number;
  color: string;
  licensePlate: string;
  vehicleType: string;
}

interface User {
  id: number;
  username: string;
  phoneNumber: string;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
}

const userAuth = async (req: UserAuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    jwt.verify(token, JWT_SECRET as string) as { id: number };
    const response = await axios.get<{ user: User; userProfile: UserProfile }>(
      `${process.env.BASE_URL}/user/getUserDetails`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const { user, userProfile } = response.data;
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    req.user = user;
    req.userProfile = userProfile;
    next();
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
    return;
  }
};

const driverAuth = async (req: DriverAuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    jwt.verify(token, JWT_SECRET as string) as { id: number };
    const response = await axios.get<{ driver: Driver; driverProfile: DriverProfile; vehicle: Vehicle }>(
      `${process.env.BASE_URL}/driver/getDriverDetails`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const driver = response.data;
    if (!driver) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    req.driver = driver.driver;
    req.vehicle = driver.vehicle;
    req.driverProfile = driver.driverProfile;
    next();
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
    return;
  }
};

export { driverAuth, userAuth };
