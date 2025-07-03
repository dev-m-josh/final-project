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
