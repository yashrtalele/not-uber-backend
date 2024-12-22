import { Request } from "express";

export interface AuthRequest extends Request {
  driver?: object;
  driverProfile?: object;
  vehicle?: object;
}
