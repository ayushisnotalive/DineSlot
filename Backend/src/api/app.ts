import authRouter from "./routes/router";
import { type Request, type Response } from "express";
import { Signup, Login, Resources, 
  Restaurant, Booking, getBooking, refresh, 
  cancelBooking, MyRestaurant, ResourcesByRestaurant, 
  ownerBooking, authMe } from "./routes/router";

authRouter.get("/verify", (req: Request, res: Response) => {
    res.send("working")
})
authRouter.use("/api/auth", Signup);
authRouter.use("/api/auth", Login);
authRouter.use("/api/restaurant", Restaurant);
authRouter.use("/api/resources", Resources);
authRouter.use("/api/booking", Booking);
authRouter.use("/api/Booking", getBooking);
authRouter.use("/api/auth", refresh);
authRouter.use("/api/cancel", cancelBooking);
authRouter.use("/api/restaurants", MyRestaurant);
authRouter.use("/api/restaurants", ResourcesByRestaurant);
authRouter.use("/api", ownerBooking);
authRouter.use("/api/auth", authMe)

export { authRouter };