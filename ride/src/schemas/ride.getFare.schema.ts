import zod from "zod";

export const GetFareSchema = zod.object({
  current: zod.string(),
  destination: zod.string(),
});

export type GetFare = zod.infer<typeof GetFareSchema>;
