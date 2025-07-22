// src/controllers/bookings.controller.ts
import { Request, Response } from "express";
import * as bookingService from "./booking.service";

export const getAllBookings = async (_req: Request, res: Response) => {
    try {
        const bookings = await bookingService.getAllBookings();
        res.json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ message: "Failed to fetch bookings" });
    }
};

export const getBookingById = async (req: Request, res: Response) => {
    try {
        const bookingId = Number(req.params.id);
        const booking = await bookingService.getBookingById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.json(booking);
    } catch (error) {
        console.error("Error fetching booking:", error);
        res.status(500).json({ message: "Failed to fetch booking" });
    }
};

export const createBooking = async (req: Request, res: Response) => {
    try {
        const booking = await bookingService.createBooking(req.body);
        res.status(201).json(booking);
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ message: "Failed to create booking" });
    }
};

export const updateBooking = async (req: Request, res: Response) => {
    try {
        const bookingId = Number(req.params.id);
        const existing = await bookingService.getBookingById(bookingId);

        if (!existing) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const updated = await bookingService.updateBooking(bookingId, req.body);
        res.json(updated);
    } catch (error) {
        console.error("Error updating booking:", error);
        res.status(500).json({ message: "Failed to update booking" });
    }
};

export const deleteBooking = async (req: Request, res: Response) => {
    try {
        const bookingId = Number(req.params.id);
        const existing = await bookingService.getBookingById(bookingId);

        if (!existing) {
            return res.status(404).json({ message: "Booking not found" });
        }

        await bookingService.deleteBooking(bookingId);
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting booking:", error);
        res.status(500).json({ message: "Failed to delete booking" });
    }
};

export const getBookingsByUserId = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.userId);

        if (isNaN(userId)) {
            return res.status(400).json({ message: "User has no bookings yet!" });
        }

        const bookings = await bookingService.getBookingsByUserId(userId);
        res.json(bookings);
    } catch (error) {
        console.error("Error fetching bookings by user:", error);
        res.status(500).json({ message: "Failed to fetch bookings by user" });
    }
};

export const getBookingsByStatus = async (req: Request, res: Response) => {
    try {
        const statusParam = req.params.status;
        let status: boolean;

        if (statusParam === "confirmed") {
            status = true;
        } else if (statusParam === "pending") {
            status = false;
        } else {
            return res.status(400).json({ message: "Invalid status" });
        }

        const bookings = await bookingService.getBookingsByStatus(status);
        res.json(bookings);
    } catch (error) {
        console.error("Error fetching bookings by status:", error);
        res.status(500).json({ message: "Failed to fetch bookings by status" });
    }
};

export const setBookingStatus = async (req: Request, res: Response) => {
    try {
        const bookingId = Number(req.params.bookingId);
        const updated = await bookingService.setBookingStatus(bookingId);
        res.json(updated);
    } catch (error) {
        console.error("Error updating booking status:", error);
        res.status(500).json({ message: "Failed to update booking status" });
    }
};
