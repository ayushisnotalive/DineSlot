import express from "express";
import { env } from "../infrastructure/configs/env";
import { connectDB } from "../infrastructure/DB/db";
import { authRouter } from "./app";
import cookieParser from "cookie-parser"
import helmet from "helmet"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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