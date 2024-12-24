import zod from "zod";

export const CreateRideSchema = zod.object({
  userId: zod.number(),
  pickup: zod.string(),
  destination: zod.string(),
  vehicleType: zod.string(),
});

export type CreateRide = zod.infer<typeof CreateRideSchema>;
