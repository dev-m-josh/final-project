// src/routes/users.route.ts
import express from "express";
import * as hotelController from "./hotel.controller";

const hotelRouter = express.Router();

hotelRouter.get("/", hotelController.getAllHotels);
hotelRouter.get("/:id", hotelController.getHotelById as any);
hotelRouter.post("/", hotelController.createHotel);
hotelRouter.delete("/:id", hotelController.deleteHotel as any);
hotelRouter.put("/:id", hotelController.updateHotel as any);


export default hotelRouter;
