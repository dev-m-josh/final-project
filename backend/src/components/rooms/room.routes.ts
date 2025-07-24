// src/routes/rooms.route.ts
import express from "express";
import * as roomsController from "./room.controller";

const roomsRouter = express.Router();

roomsRouter.get("/", roomsController.getAllRooms);
roomsRouter.get("/details/:id", roomsController.getRoomById as any);
roomsRouter.post("/add", roomsController.createRoom);
roomsRouter.put("/update/:id", roomsController.updateRoom as any);
roomsRouter.delete("/delete/:id", roomsController.deleteRoom as any);
roomsRouter.get("/hotel/:hotelId", roomsController.getRoomsByHotelId as any);

export default roomsRouter;
