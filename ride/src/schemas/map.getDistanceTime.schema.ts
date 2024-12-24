import zod from "zod";

export const GetDistanceTimeSchema = zod.object({
  current: zod.string().min(3),
  destinaton: zod.string().min(3),
});

export type GetDistanceTime = zod.infer<typeof GetDistanceTimeSchema>;
