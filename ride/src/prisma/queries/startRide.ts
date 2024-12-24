import { PrismaClient, Status } from "@prisma/client";

const prisma = new PrismaClient();

export const startRide = async (rideId: number, otp: string, driverId: number) => {
  const ride = await prisma.ride.update({
    where: {
      id: rideId,
      otp: otp,
      driverId: driverId,
    },
    data: {
      status: Status.started,
      started_at: new Date(),
    },
    select: {
      id: true,
      userId: true,
      driverId: true,
      pickup: true,
      status: true,
      fare: true,
      destination: true,
      started_at: true,
      created_at: true,
      updated_at: true,
    },
  });
  return ride;
};
