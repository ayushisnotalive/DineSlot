import express from "express";
import { env } from "../infrastructure/configs/env";
import { connectDB } from "../infrastructure/DB/db";
import { authRouter } from "./app";
import cookieParser from "cookie-parser"
import helmet from "helmet"
import cors from "cors";
import { urlencoded } from "express";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://dine-slot-six.vercel.app",
  "https://dine-slot-git-prod-ayushz-20s-projects.vercel.app",
];

authRouter.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

authRouter.use(urlencoded({ extended: true }));
authRouter.use(express.json());

app.use(cookieParser());

app.use(helmet()); 

app.use("/", authRouter);

const startServer = async () => {
    try {
        await connectDB();

        app.listen(env.PORT, () => {
            console.log(`🚀 Server is running on PORT: ${env.PORT}`);
        });
    } catch (err) {
        console.error("❌ Failed to start server:", err);
        process.exit(1);
    }
};

startServer();