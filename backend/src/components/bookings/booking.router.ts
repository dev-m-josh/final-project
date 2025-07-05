// src/routes/bookings.route.ts
import express from "express";
import * as bookingsController from "./booking.controller";

const bookingRouter = express.Router();

bookingRouter.get("/", bookingsController.getAllBookings);
bookingRouter.get("/:id", bookingsController.getBookingById as any);
bookingRouter.post("/", bookingsController.createBooking);
bookingRouter.put("/:id", bookingsController.updateBooking as any);
bookingRouter.delete("/:id", bookingsController.deleteBooking as any);
bookingRouter.get("/user/:userId", bookingsController.getBookingsByUserId as any);
bookingRouter.get("/status/:status", bookingsController.getBookingsByStatus as any);

export default bookingRouter;
