// src/routes/bookings.route.ts
import express from "express";
import * as bookingsController from "./booking.controller";

const bookingRouter = express.Router();

bookingRouter.get("/", bookingsController.getAllBookings);
bookingRouter.get("/details/:id", bookingsController.getBookingById as any);
bookingRouter.post("/add", bookingsController.createBooking);
bookingRouter.put("/update/:id", bookingsController.updateBooking as any);
bookingRouter.delete("/delete/:id", bookingsController.deleteBooking as any);
bookingRouter.get("/user/:userId", bookingsController.getBookingsByUserId as any);
bookingRouter.put("/confirm/:bookingId", bookingsController.setBookingStatus as any);
bookingRouter.get("/status/:status", bookingsController.getBookingsByStatus as any);

export default bookingRouter;
