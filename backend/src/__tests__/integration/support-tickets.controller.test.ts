import request from "supertest";
import express from "express";
import {
    getAllTickets,
    getTicketById,
    getTicketByUserId,
    getTicketByStatus,
    createTicket,
    updateTicket,
    deleteTicket,
} from "../../components/support-tickets/support-tickets.controller";
import * as TicketService from "../../components/support-tickets/support-tickets.service";

const app = express();
app.use(express.json());

app.get("/tickets", getAllTickets as any);
app.get("/tickets/:id", getTicketById as any);
app.get("/tickets/user/:userId", getTicketByUserId as any);
app.get("/tickets/status/:status", getTicketByStatus as any);
app.post("/tickets", createTicket as any);
app.put("/tickets/:id", updateTicket as any);
app.delete("/tickets/:id", deleteTicket as any);

jest.mock("../../components/support-tickets/support-tickets.service");

beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
});

describe("Support Tickets Controller - Integration Tests", () => {
    const mockTicket = {
        ticketId: 1,
        userId: 1,
        subject: "Login issue",
        message: "Can't log in",
        status: "Open",
        createdAt: new Date().toISOString(),
    };

    test("GET /tickets - success", async () => {
        (TicketService.getAllTickets as jest.Mock).mockResolvedValue([mockTicket]);
        const res = await request(app).get("/tickets");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([mockTicket]);
    });

    test("GET /tickets/:id - success", async () => {
        (TicketService.getTicketById as jest.Mock).mockResolvedValue(mockTicket);
        const res = await request(app).get("/tickets/1");
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockTicket);
    });

    test("GET /tickets/:id - not found", async () => {
        (TicketService.getTicketById as jest.Mock).mockResolvedValue(null);
        const res = await request(app).get("/tickets/999");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Ticket not found" });
    });

    test("GET /tickets/user/:userId - success", async () => {
        (TicketService.getTicketByUserId as jest.Mock).mockResolvedValue(mockTicket);
        const res = await request(app).get("/tickets/user/1");
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockTicket);
    });

    test("GET /tickets/user/:userId - not found", async () => {
        (TicketService.getTicketByUserId as jest.Mock).mockResolvedValue(null);
        const res = await request(app).get("/tickets/user/99");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Ticket not found for user" });
    });

    test("GET /tickets/status/:status - success", async () => {
        (TicketService.getTicketByStatus as jest.Mock).mockResolvedValue(mockTicket);
        const res = await request(app).get("/tickets/status/Open");
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockTicket);
    });

    test("GET /tickets/status/:status - invalid status", async () => {
        const res = await request(app).get("/tickets/status/unknown");
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: "Invalid status value" });
    });

    test("GET /tickets/status/:status - not found", async () => {
        (TicketService.getTicketByStatus as jest.Mock).mockResolvedValue(null);
        const res = await request(app).get("/tickets/status/Closed");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "No tickets found for this status" });
    });

    test("POST /tickets - success", async () => {
        (TicketService.createTicket as jest.Mock).mockResolvedValue(mockTicket);
        const res = await request(app).post("/tickets").send(mockTicket);
        expect(res.status).toBe(201);
        expect(res.body).toEqual(mockTicket);
    });

    test("PUT /tickets/:id - success", async () => {
        (TicketService.getTicketById as jest.Mock).mockResolvedValue(mockTicket);
        (TicketService.updateTicket as jest.Mock).mockResolvedValue({ ...mockTicket, status: "Resolved" });
        const res = await request(app).put("/tickets/1").send({ status: "Resolved" });
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("Resolved");
    });

    test("PUT /tickets/:id - not found", async () => {
        (TicketService.getTicketById as jest.Mock).mockResolvedValue(null);
        const res = await request(app).put("/tickets/1").send({ status: "Resolved" });
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Ticket not found" });
    });

    test("DELETE /tickets/:id - success", async () => {
        (TicketService.getTicketById as jest.Mock).mockResolvedValue(mockTicket);
        const res = await request(app).delete("/tickets/1");
        expect(res.status).toBe(204);
    });

    test("DELETE /tickets/:id - not found", async () => {
        (TicketService.getTicketById as jest.Mock).mockResolvedValue(null);
        const res = await request(app).delete("/tickets/1");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Ticket not found" });
    });

    // 500 error cases
    test("GET /tickets - failure", async () => {
        (TicketService.getAllTickets as jest.Mock).mockRejectedValue(new Error("DB Error"));
        const res = await request(app).get("/tickets");
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to fetch tickets" });
    });

    test("GET /tickets/:id - failure", async () => {
        (TicketService.getTicketById as jest.Mock).mockRejectedValue(new Error("DB Error"));
        const res = await request(app).get("/tickets/1");
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to fetch ticket" });
    });

    test("GET /tickets/user/:userId - failure", async () => {
        (TicketService.getTicketByUserId as jest.Mock).mockRejectedValue(new Error("DB Error"));
        const res = await request(app).get("/tickets/user/1");
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to fetch ticket by user" });
    });

    test("GET /tickets/status/:status - failure", async () => {
        (TicketService.getTicketByStatus as jest.Mock).mockRejectedValue(new Error("DB Error"));
        const res = await request(app).get("/tickets/status/Open");
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to fetch ticket by status" });
    });

    test("POST /tickets - failure", async () => {
        (TicketService.createTicket as jest.Mock).mockRejectedValue(new Error("DB Error"));
        const res = await request(app).post("/tickets").send(mockTicket);
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to create ticket" });
    });

    test("PUT /tickets/:id - failure", async () => {
        (TicketService.getTicketById as jest.Mock).mockResolvedValue(mockTicket);
        (TicketService.updateTicket as jest.Mock).mockRejectedValue(new Error("DB Error"));
        const res = await request(app).put("/tickets/1").send({ status: "Closed" });
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to update ticket" });
    });

    test("DELETE /tickets/:id - failure", async () => {
        (TicketService.getTicketById as jest.Mock).mockResolvedValue(mockTicket);
        (TicketService.deleteTicket as jest.Mock).mockRejectedValue(new Error("DB Error"));
        const res = await request(app).delete("/tickets/1");
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to delete ticket" });
    });
});
