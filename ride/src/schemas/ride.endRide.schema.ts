import zod from "zod";

export const EndRideSchema = zod.object({
  rideId: zod.number(),
  driverId: zod.number(),
});

export type EndRide = zod.infer<typeof EndRideSchema>;
