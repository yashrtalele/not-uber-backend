import { Request } from "express";
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

export interface UserAuthRequest extends Request {
  user?: User;
  userProfile?: UserProfile;
}

export interface DriverAuthRequest extends Request {
  driver?: Driver;
  driverProfile?: DriverProfile;
  vehicle?: Vehicle;
}

export interface CreateRideAuthRequest extends Request {
  user?: User;
}

export interface AcceptRideAuthRequest extends Request {
  driver?: Driver;
}

export interface EndRideAuthRequest extends Request {
  driver?: Driver;
}

export interface StartRideAuthRequest extends Request {
  driver?: Driver;
}
