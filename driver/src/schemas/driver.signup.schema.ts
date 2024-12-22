import zod from "zod";
import validator from "validator";

export const DriverSignUpSchema = zod.object({
  phoneNumber: zod.string().refine((value) => validator.isMobilePhone(value, "en-IN")),
  email: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string().optional(),
  password: zod.string().min(6),
  brand: zod.string(),
  model: zod.string(),
  vehicleType: zod.string(),
  color: zod.string(),
  capacity: zod.number().gte(2).lte(7),
  licensePlate: zod.string(),
});

export type UserSignUp = zod.infer<typeof DriverSignUpSchema>;
