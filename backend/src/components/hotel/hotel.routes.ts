// src/routes/users.route.ts
import express from "express";
import * as hotelController from "./hotel.controller";

const hotelRouter = express.Router();

hotelRouter.get("/", hotelController.getAllHotels);
hotelRouter.get("/details/:id", hotelController.getHotelById as any);
hotelRouter.post("/add", hotelController.createHotel);
hotelRouter.delete("/delete/:id", hotelController.deleteHotel as any);
hotelRouter.put("/update/:id", hotelController.updateHotel as any);
hotelRouter.get("/location/:location", hotelController.getHotelsByLocation);

export default hotelRouter;
