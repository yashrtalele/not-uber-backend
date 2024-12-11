import zod from "zod";
import validator from "validator";

export const UserSignUpSchema = zod.object({
  username: zod.string(),
  phoneNumber: zod.string().refine((value) => validator.isMobilePhone(value, "en-IN")),
  email: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string().optional(),
  password: zod.string().min(6),
});

export type UserSignUp = zod.infer<typeof UserSignUpSchema>;
