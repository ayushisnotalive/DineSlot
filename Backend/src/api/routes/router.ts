import { Router } from "express";
import express, { urlencoded } from "express";
import type {Response} from "express";
import { signup } from "../../modules/signup/signup";
import { login } from "../../modules/login/login";
import { authenticate } from "../middleware/authenticate";
// import { verifyCsrf } from "../middleware/csrf";
import { loginLimiter,registerLimiter, refreshLimiter  } from "../middleware/rate_limit";
import { loginSchema, registerSchema } from "../../infrastructure/services/auth.validator";
import { validate } from "../middleware/validator";
import { refreshRotation } from "../../modules/auth/refresh";

// core pages-backend-imports
import { CreateResources } from "../../modules/resources/resources.create";
import { CreateRestaurant } from "../../modules/restaurant/restaurant.create";
import { CreateBooking} from "../../modules/Booking/Booking.create";
import { getMyBookings } from "../../modules/Booking/booking.get";
import { cancelMyBooking } from "../../modules/Booking/booking.cancel";
import { getMyRestaurant } from "../../modules/restaurant/restaurant.mine";
import { getResourcesByRestaurant } from "../../modules/resources/resources.get";
import { getOwnerBookings } from "../../modules/Booking/get.owner.booking";


const authRouter = Router();

authRouter.use(urlencoded({ extended: true }));
authRouter.use(express.json());



authRouter.get("/",(_,res:Response)=>{
    res.json({
        success: true,
        message : "resturant booking system"
    })
})

export const refresh = authRouter.post("/refresh",refreshRotation);

export const  Signup = authRouter.post("/signup", registerLimiter,validate(registerSchema),signup);
export const Login = authRouter.post("/login",loginLimiter,validate(loginSchema),login);

export const Restaurant = authRouter.post("/createRestaurant",authenticate, CreateRestaurant);
export const Resources = authRouter.post("/createResources", authenticate,CreateResources);
export const MyRestaurant = authRouter.get("/mine", authenticate, getMyRestaurant);
export const ResourcesByRestaurant = authRouter.get("/resources",authenticate,getResourcesByRestaurant );

export const Booking = authRouter.post("/createBookings", authenticate,CreateBooking);
export const getBooking = authRouter.get("/getbookings",authenticate,getMyBookings);
export const cancelBooking = authRouter.patch("/bookings/:id/cancel", authenticate, cancelMyBooking);
export const ownerBooking = authRouter.get("/bookings/owner", authenticate, getOwnerBookings);

export default authRouter;