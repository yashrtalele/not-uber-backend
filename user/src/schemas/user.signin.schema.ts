import zod from "zod";

export const UserSignInSchema = zod.object({
  username: zod.string(),
  password: zod.string(),
});

export type UserSignIn = zod.infer<typeof UserSignInSchema>;
