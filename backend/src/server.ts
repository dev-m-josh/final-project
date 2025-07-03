import express from "express";
import { connectToDB } from "../src/drizzle/db";
import cors from "cors";
import userRouter from "../src/components/user/user.routes";
import hotelRouter from "./components/hotel/hotel.routes";
import roomsRouter from "./components/rooms/room.routes";
import bookingRouter from "./components/bookings/booking.router";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use("/hotel", hotelRouter);
app.use("/rooms", roomsRouter);
app.use("/bookings", bookingRouter);

// a testing route
app.get("/", (req, res) => {
    res.send("Welcome to the Hotel Booking API!");
});

connectToDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to the database:", err);
    });

export default app;
