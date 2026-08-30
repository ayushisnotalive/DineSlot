import {z} from "zod"

export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().min(3, "Username must be at least 3 characters").max(20),
  password: z.string().min(8, "Password must be at least 8 characters"),
  mobile_no: z.string().regex(/^\d{10}$/, "Mobile number must be 10 digits"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1),
});