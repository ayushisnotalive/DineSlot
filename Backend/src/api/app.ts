import authRouter from "./routes/router";
import { urlencoded, type Request,type Response } from "express";
import express from "express";
import { Signup, Login, Resources, Restaurant, Booking, getBooking, refresh, cancelBooking, MyRestaurant , ResourcesByRestaurant, ownerBooking} from "./routes/router";
import { url } from "inspector";


authRouter.use(urlencoded({ extended: true }));
authRouter.use(express.json());

import cors from "cors";

const allowedOrigins = [
  "http://localhost:5173",
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


authRouter.get("/verify",(req:Request, res:Response)=>{
    res.send("working")
})
authRouter.use("/api/auth",Signup);
authRouter.use("/api/auth",Login);
authRouter.use("/api/restaurant",Restaurant);
authRouter.use("/api/resources",Resources);
authRouter.use("/api/booking",Booking);
authRouter.use("/api/Booking",getBooking);
authRouter.use("/api/auth",refresh);
authRouter.use("/api/cancel",cancelBooking);
authRouter.use("/api/restaurants",MyRestaurant);
authRouter.use("/api/restaurants", ResourcesByRestaurant);
authRouter.use("/api",ownerBooking);

export {authRouter};