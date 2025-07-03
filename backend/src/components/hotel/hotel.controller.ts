// src/controllers/hotels.controller.ts
import { Request, Response } from "express";
import * as hotelService from "./hotel.service";

export const getAllHotels = async (_req: Request, res: Response) => {
    try {
        const hotels = await hotelService.getAllHotels();
        res.json(hotels);
    } catch (error) {
        console.error("Error fetching hotels:", error);
        res.status(500).json({ message: "Failed to fetch hotels" });
    }
};

export const getHotelById = async (req: Request, res: Response) => {
    try {
        const hotelId = Number(req.params.id);
        const hotel = await hotelService.getHotelById(hotelId);

        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        res.json(hotel);
    } catch (error) {
        console.error("Error fetching hotel:", error);
        res.status(500).json({ message: "Failed to fetch hotel" });
    }
};

export const createHotel = async (req: Request, res: Response) => {
    try {
        const hotel = await hotelService.createHotel(req.body);
        res.status(201).json(hotel);
    } catch (error) {
        console.error("Error creating hotel:", error);
        res.status(500).json({ message: "Failed to create hotel" });
    }
};

export const deleteHotel = async (req: Request, res: Response) => {
    try {
        const hotelId = Number(req.params.id);
        const hotel = await hotelService.getHotelById(hotelId);

        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        await hotelService.deleteHotel(hotelId);
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting hotel:", error);
        res.status(500).json({ message: "Failed to delete hotel" });
    }
};

export const updateHotel = async (req: Request, res: Response) => {
    try {
        const hotelId = Number(req.params.id);
        const existingHotel = await hotelService.getHotelById(hotelId);

        if (!existingHotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        const updatedHotel = await hotelService.updateHotel(hotelId, req.body);
        res.json(updatedHotel);
    } catch (error) {
        console.error("Error updating hotel:", error);
        res.status(500).json({ message: "Failed to update hotel" });
    }
};

export const getHotelsByLocation = async (req: Request, res: Response) => {
    try {
        const location = req.params.location;
        const hotels = await hotelService.getHotelsByLocation(location);
        res.json(hotels);
    } catch (error) {
        console.error("Error fetching hotels by location:", error);
        res.status(500).json({ message: "Failed to fetch hotels by location" });
    }
};
