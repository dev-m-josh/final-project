// src/controllers/rooms.controller.ts
import { Request, Response } from "express";
import * as roomService from "./room.service";

export const getAllRooms = async (_req: Request, res: Response) => {
    try {
        const rooms = await roomService.getAllRooms();
        res.json(rooms);
    } catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({ message: "Failed to fetch rooms" });
    }
};

export const getRoomById = async (req: Request, res: Response) => {
    try {
        const roomId = Number(req.params.id);
        const room = await roomService.getRoomById(roomId);

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        res.json(room);
    } catch (error) {
        console.error("Error fetching room:", error);
        res.status(500).json({ message: "Failed to fetch room" });
    }
};

export const createRoom = async (req: Request, res: Response) => {
    try {
        const room = await roomService.createRoom(req.body);
        res.status(201).json(room);
    } catch (error) {
        console.error("Error creating room:", error);
        res.status(500).json({ message: "Failed to create room" });
    }
};

export const deleteRoom = async (req: Request, res: Response) => {
    try {
        const roomId = Number(req.params.id);
        const room = await roomService.getRoomById(roomId);

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        await roomService.deleteRoom(roomId);
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting room:", error);
        res.status(500).json({ message: "Failed to delete room" });
    }
};

export const updateRoom = async (req: Request, res: Response) => {
    try {
        const roomId = Number(req.params.id);
        const existingRoom = await roomService.getRoomById(roomId);

        if (!existingRoom) {
            return res.status(404).json({ message: "Room not found" });
        }

        const updatedRoom = await roomService.updateRoom(roomId, req.body);
        res.json(updatedRoom);
    } catch (error) {
        console.error("Error updating room:", error);
        res.status(500).json({ message: "Failed to update room" });
    }
};

export const getRoomsByHotelId = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.userId);
        const rooms = await roomService.getRoomsByHotelId(userId);
        res.json(rooms);
    } catch (error) {
        console.error("Error fetching rooms by userId:", error);
        res.status(500).json({ message: "Failed to fetch rooms by user" });
    }
};