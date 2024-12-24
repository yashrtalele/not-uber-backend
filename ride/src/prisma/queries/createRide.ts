import { PrismaClient, Status } from "@prisma/client";
import { generateOTP, getFare } from "../../services/rideService";
import { getDistanceTime } from "../../services/mapService";

const prisma = new PrismaClient();

interface RideType {
  id: number;
  userId: number;
  driverId: number | null;
  pickup: string;
  status: Status;
  destination: string;
  otp: string;
  fare: number;
  created_at: Date;
  updated_at: Date;
}

export const createRide = async (
  userId: number,
  pickup: string,
  destination: string,
  vehicleType: string
): Promise<RideType> => {
  const otp = generateOTP(6);
  const fare = await getFare(pickup, destination);
  const distanceTime = await getDistanceTime(pickup, destination);
  const vehicleFare = fare[vehicleType as keyof typeof fare];
  const ride = await prisma.ride.create({
    data: {
      userId,
      pickup,
      fare: vehicleFare,
      distance: distanceTime.distance.value,
      duration: distanceTime.duration.value,
      destination,
      otp,
    },
    select: {
      id: true,
      userId: true,
      driverId: true,
      pickup: true,
      status: true,
      destination: true,
      otp: true,
      fare: true,
      created_at: true,
      updated_at: true,
    },
  });

  return ride;
};
