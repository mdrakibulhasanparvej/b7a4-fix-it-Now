import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { userRouter } from "../modules/user/user.route";
import { categoryRoutes } from "../modules/category/category.route";
import { serviceRoutes } from "../modules/service/service.route";
import {
  technicianRoutes,
  technicianProfileRoutes,
  technicianAvailabilityRoutes,
  technicianBookingRoutes,
} from "../modules/technician/technician.route";
import { bookingRoutes } from "../modules/booking/booking.route";
import { paymentRoutes } from "../modules/payment/payment.route";
import { reviewRoutes } from "../modules/review/review.route";
import { adminRoutes } from "../modules/admin/admin.route";

const router = Router();

// The moduleRoutes array defines the routes for different modules in the application. Each route is associated with a specific path and the corresponding route handler. The routes include authentication, user management, category management, service management, technician management (including profile, availability, and bookings), booking management, payment processing, review management, and admin functionalities. The router uses these routes to handle incoming requests and direct them to the appropriate module for processing.

const moduleRoutes = [
  { path: "/auth", route: authRoutes },
  { path: "/users", route: userRouter },
  { path: "/categories", route: categoryRoutes },
  { path: "/services", route: serviceRoutes },
  { path: "/technicians", route: technicianRoutes },
  { path: "/technician/profile", route: technicianProfileRoutes },
  { path: "/technician/availability", route: technicianAvailabilityRoutes },
  { path: "/technician/bookings", route: technicianBookingRoutes },
  { path: "/bookings", route: bookingRoutes },
  { path: "/payments", route: paymentRoutes },
  { path: "/reviews", route: reviewRoutes },
  { path: "/admin", route: adminRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
