// src/routes/rooms.route.ts
import express from "express";
import * as roomsController from "./room.controller";

const roomsRouter = express.Router();

roomsRouter.get("/", roomsController.getAllRooms);
roomsRouter.get("/:id", roomsController.getRoomById as any);
roomsRouter.post("/", roomsController.createRoom);
roomsRouter.put("/:id", roomsController.updateRoom as any);
roomsRouter.delete("/:id", roomsController.deleteRoom as any);
roomsRouter.get("/hotel/:hotelId", roomsController.getRoomsByHotelId as any);

export default roomsRouter;
