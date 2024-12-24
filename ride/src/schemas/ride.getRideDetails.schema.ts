import zod from "zod";

export const GetRideDetailsSchema = zod.object({
  rideId: zod.number(),
});

export type GetRideDetails = zod.infer<typeof GetRideDetailsSchema>;
