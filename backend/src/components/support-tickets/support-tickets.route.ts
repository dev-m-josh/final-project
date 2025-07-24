// src/routes/support-tickets.route.ts
import express from "express";
import * as ticketController from "./support-tickets.controller";

const supportTicketsRouter = express.Router();

// General ticket routes
supportTicketsRouter.get("/", ticketController.getAllTickets);
supportTicketsRouter.get("/details/:id", ticketController.getTicketById as any);
supportTicketsRouter.post("/add", ticketController.createTicket);
supportTicketsRouter.put("/update/:id", ticketController.updateTicket as any);
supportTicketsRouter.delete("/delete/:id", ticketController.deleteTicket as any);
supportTicketsRouter.get("/user/:userId", ticketController.getTicketByUserId as any);
supportTicketsRouter.get("/status/:status", ticketController.getTicketByStatus as any);

export default supportTicketsRouter;
