import express from "express";
import { connectToDB } from "./drizzle/db";
import cors from "cors";
import router from "./users/user.routes";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/users", router);

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
