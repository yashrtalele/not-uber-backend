import { PrismaClient, Status } from "@prisma/client";

const prisma = new PrismaClient();

interface RideType {
  id: number;
  userId: number;
  driverId: number | null;
  pickup: string;
  status: Status;
  destination: string;
  created_at: Date;
  updated_at: Date;
}

export const acceptRide = async (rideId: number, driverId: number): Promise<RideType> => {
  const ride = await prisma.ride.update({
    where: {
      id: rideId,
    },
    data: {
      driverId,
      status: Status.accepted,
    },
    select: {
      id: true,
      userId: true,
      driverId: true,
      pickup: true,
      status: true,
      destination: true,
      created_at: true,
      updated_at: true,
    },
  });
  return ride;
};
