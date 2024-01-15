import { z } from "zod";

export const UserRegisterValidator = z.object({
  name: z.string().min(1, {
    message: "username is required"
  }),
  email: z.string().min(1, {
    message: "email is required"
  }),
  password: z.string().min(1, {
    message: "password is required"
  })
});
