import { PrismaClient, Status } from "@prisma/client";

const prisma = new PrismaClient();

export const endRide = async (rideId: number, driverId: number) => {
  const ride = await prisma.ride.update({
    where: {
      id: rideId,
      driverId: driverId,
    },
    data: {
      status: Status.completed,
      completed_at: new Date(),
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
