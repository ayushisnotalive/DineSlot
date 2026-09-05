import { Router } from "express";
import express, { urlencoded } from "express";
import type { Response } from "express";
import { signup } from "../../modules/signup/signup";
import { login } from "../../modules/login/login";
import { authenticate } from "../middleware/authenticate";
import { loginSchema, registerSchema } from "../../infrastructure/services/auth.validator";
import { validate } from "../middleware/validator";
import { refreshRotation } from "../../modules/auth/refresh";
import { CreateResources } from "../../modules/resources/resources.create";
import { CreateRestaurant } from "../../modules/restaurant/restaurant.create";
import { CreateBooking } from "../../modules/Booking/Booking.create";
import { getMyBookings } from "../../modules/Booking/booking.get";
import { cancelMyBooking } from "../../modules/Booking/booking.cancel";
import { getMyRestaurant } from "../../modules/restaurant/restaurant.mine";
import { getResourcesByRestaurant } from "../../modules/resources/resources.get";
import { getOwnerBookings } from "../../modules/Booking/get.owner.booking";
import { Me } from "../../modules/auth/me";
import {logout} from "../../modules/auth/logout";
import {getAllRestaurants} from "../../modules/restaurant/restaurant.getAll";
import { getPublicResources } from "../../modules/resources/resource.getAll";

const authRouter = Router();

authRouter.use(urlencoded({ extended: true }));
authRouter.use(express.json());

authRouter.get("/", (_, res: Response) => {
    res.json({ success: true, message: "resturant booking system" });
});

// auth
authRouter.post("/api/auth/signup", validate(registerSchema), signup);
authRouter.post("/api/auth/login", validate(loginSchema), login);
authRouter.post("/api/auth/refresh", refreshRotation);
authRouter.get("/api/auth/me", authenticate, Me);
authRouter.post("/api/auth/logout", logout);
// restaurant
authRouter.post("/api/restaurant/createRestaurant", authenticate, CreateRestaurant);
authRouter.get("/api/restaurants/mine", authenticate, getMyRestaurant);
authRouter.get("/api/restaurants", getAllRestaurants);
// resources
authRouter.post("/api/resources/createResources", authenticate, CreateResources);
authRouter.get("/api/restaurants/resources", authenticate, getResourcesByRestaurant);
authRouter.get("/api/public/resources", getPublicResources);

// bookings
authRouter.post("/api/booking/createBookings", authenticate, CreateBooking);
authRouter.get("/api/Booking/getbookings", authenticate, getMyBookings);
authRouter.patch("/api/cancel/bookings/:id/cancel", authenticate, cancelMyBooking);
authRouter.get("/api/bookings/owner", authenticate, getOwnerBookings);

export default authRouter;