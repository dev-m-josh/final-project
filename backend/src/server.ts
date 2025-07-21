import express from "express";
import { connectToDB } from "./drizzle/db";
import cors from "cors";
import userRouter from "./components/user/user.routes";
import hotelRouter from "./components/hotel/hotel.routes";
import roomsRouter from "./components/rooms/room.routes";
import bookingRouter from "./components/bookings/booking.router";
import auth from "./components/auth/auth.routes";
import paymentRouter from "./components/payments/payment.router";
import supportTicketsRouter from "./components/support-tickets/support-tickets.route";
import darajaRouter from "./components/daraja/daraja.route";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/auth", auth);
app.use("/users", userRouter);
app.use("/hotels", hotelRouter);
app.use("/rooms", roomsRouter);
app.use("/bookings", bookingRouter);
app.use("/payments", paymentRouter);
app.use("/support-tickets", supportTicketsRouter)
app.use("/api/daraja", darajaRouter);

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
