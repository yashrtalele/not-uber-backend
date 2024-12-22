import zod from "zod";

export const DriverSignInSchema = zod.object({
  phoneNumber: zod.string(),
  password: zod.string(),
});

export type UserSignIn = zod.infer<typeof DriverSignInSchema>;
