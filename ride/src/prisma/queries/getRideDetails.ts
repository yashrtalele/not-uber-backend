import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getRideDetails = async (rideId: number) => {
  const ride = await prisma.ride.findUnique({
    where: {
      id: rideId,
    },
    select: {
      id: true,
      userId: true,
      driverId: true,
      pickup: true,
      status: true,
      fare: true,
      otp: true,
      distance: true,
      duration: true,
      destination: true,
      started_at: true,
      completed_at: true,
      paymentId: true,
      created_at: true,
      updated_at: true,
    },
  });
  return ride;
};
