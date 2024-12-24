import zod from "zod";

export const StartRideSchema = zod.object({
  rideId: zod.number(),
  otp: zod.string().length(6),
  driverId: zod.number(),
});

export type StartRide = zod.infer<typeof StartRideSchema>;
