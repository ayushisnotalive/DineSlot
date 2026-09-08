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
import { requireRole } from "../middleware/requireRole";
import { promoteToOwner } from "../../modules/admin/promote";
import { listAllUsers } from "../../modules/admin/users.list";
import { setUserRole } from "../../modules/admin/users.setRole";
import { rateLimiter } from "../middleware/rateLimiter";
import { deleteUser } from "../../modules/admin/delete";
import {updateBookingStatus} from "../../modules/Booking/booking.updateStatus";


const authRouter = Router();

authRouter.use(urlencoded({ extended: true }));
authRouter.use(express.json());

authRouter.get("/", (_, res: Response) => {
    res.json({ success: true, message: "resturant booking system" });
});

// auth
authRouter.post("/api/auth/signup",rateLimiter({ windowSeconds: 60, maxRequests: 3 }), validate(registerSchema), signup);
authRouter.post("/api/auth/login",rateLimiter({ windowSeconds: 60, maxRequests: 5 }), validate(loginSchema), login);
authRouter.post("/api/auth/refresh", refreshRotation);
authRouter.get("/api/auth/me", authenticate, Me);
authRouter.post("/api/auth/logout", logout);

// restaurant
authRouter.post("/api/restaurant/createRestaurant", authenticate, requireRole(["owner"]), CreateRestaurant);
authRouter.get("/api/restaurants/mine", authenticate, getMyRestaurant);
authRouter.get("/api/restaurants", getAllRestaurants);

// resources
authRouter.post("/api/resources/createResources", authenticate, requireRole(["owner"]), CreateResources);
authRouter.get("/api/restaurants/resources", authenticate, getResourcesByRestaurant);
authRouter.get("/api/public/resources", getPublicResources);

// bookings
authRouter.post("/api/booking/createBookings", authenticate, CreateBooking);
authRouter.get("/api/Booking/getbookings", authenticate, getMyBookings);
authRouter.patch("/api/cancel/bookings/:id/cancel", authenticate, cancelMyBooking);
authRouter.get("/api/bookings/owner", authenticate, getOwnerBookings);
authRouter.patch("/api/bookings/:id/status", authenticate, requireRole(["owner"]), updateBookingStatus);

// role based users implementation
authRouter.post("/api/admin/promote", authenticate, requireRole(["admin"]), promoteToOwner);
authRouter.get("/api/admin/users", authenticate, requireRole(["admin"]), listAllUsers);
authRouter.patch("/api/admin/users/role", authenticate, requireRole(["admin"]), setUserRole);
authRouter.delete("/api/auth/deleteUser",authenticate, requireRole(["admin"]),deleteUser)

export default authRouter;