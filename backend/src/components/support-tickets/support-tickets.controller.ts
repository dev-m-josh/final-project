import { Request, Response } from "express";
import * as ticketService from "./support-tickets.service";

export const getAllTickets = async (_req: Request, res: Response) => {
    try {
        const tickets = await ticketService.getAllTickets();
        res.json(tickets);
    } catch (error) {
        console.error("Error fetching tickets:", error);
        res.status(500).json({ message: "Failed to fetch tickets" });
    }
};

export const getTicketById = async (req: Request, res: Response) => {
    try {
        const ticketId = Number(req.params.id);
        const ticket = await ticketService.getTicketById(ticketId);

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        res.json(ticket);
    } catch (error) {
        console.error("Error fetching ticket:", error);
        res.status(500).json({ message: "Failed to fetch ticket" });
    }
};

export const getTicketByUserId = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.userId);
        const ticket = await ticketService.getTicketByUserId(userId);

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found for user" });
        }

        res.json(ticket);
    } catch (error) {
        console.error("Error fetching ticket by userId:", error);
        res.status(500).json({ message: "Failed to fetch ticket by user" });
    }
};

export const getTicketByStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.params;
        if (!["Open", "In Progress", "Resolved", "Closed"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const ticket = await ticketService.getTicketByStatus(status as any);

        if (!ticket) {
            return res.status(404).json({ message: "No tickets found for this status" });
        }

        res.json(ticket);
    } catch (error) {
        console.error("Error fetching ticket by status:", error);
        res.status(500).json({ message: "Failed to fetch ticket by status" });
    }
};

export const createTicket = async (req: Request, res: Response) => {
    try {
        const ticket = await ticketService.createTicket(req.body);
        res.status(201).json(ticket);
    } catch (error) {
        console.error("Error creating ticket:", error);
        res.status(500).json({ message: "Failed to create ticket" });
    }
};

export const updateTicket = async (req: Request, res: Response) => {
    try {
        const ticketId = Number(req.params.id);
        const existing = await ticketService.getTicketById(ticketId);

        if (!existing) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        const updated = await ticketService.updateTicket(ticketId, req.body);
        res.json(updated);
    } catch (error) {
        console.error("Error updating ticket:", error);
        res.status(500).json({ message: "Failed to update ticket" });
    }
};

export const deleteTicket = async (req: Request, res: Response) => {
    try {
        const ticketId = Number(req.params.id);
        const existing = await ticketService.getTicketById(ticketId);

        if (!existing) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        await ticketService.deleteTicket(ticketId);
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting ticket:", error);
        res.status(500).json({ message: "Failed to delete ticket" });
    }
};
