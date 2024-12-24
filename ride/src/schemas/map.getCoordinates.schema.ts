import zod from "zod";

export const GetCoordinatesSchema = zod.object({
  address: zod.string(),
});

export type GetCoordinates = zod.infer<typeof GetCoordinatesSchema>;
