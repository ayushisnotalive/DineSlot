import {z} from "zod"
import * as dotenv from "dotenv"


dotenv.config({path:require("path").resolve(__dirname,"../../../.env")});

const envSchema = z.object({
    PORT : z.string().transform(Number).default(5000),
    DATABASE_URL: z
      .string()
      .min(1, "DB_URI is required")
      .regex(
        /^postgres(ql)?:\/\/[^:]+:[^@]+@[^:/]+(:\d+)?\/[^?]+/,
        "DB_URI must be a valid postgres connection string"
      ),
    JWT_ACCESS_SECRET : z.string(),
    JWT_REFRESH_SECRET : z.string(),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
})

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  throw new Error("Invalid environment variables");
}


export const env = parsed.data;