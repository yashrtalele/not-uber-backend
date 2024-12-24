import zod from "zod";

export const AcceptRideSchema = zod.object({
  rideId: zod.number(),
  driverId: zod.number(),
});

export type AcceptRide = zod.infer<typeof AcceptRideSchema>;
