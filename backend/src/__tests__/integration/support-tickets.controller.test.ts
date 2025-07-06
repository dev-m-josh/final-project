import request from "supertest";
import express from "express";
import * as TicketController from "../../components/support-tickets/support-tickets.controller";
import * as TicketService from "../../components/support-tickets/support-tickets.service";

const app = express();
app.use(express.json());

app.get("/tickets", TicketController.getAllTickets as any);
app.get("/tickets/:id", TicketController.getTicketById as any);
app.get("/tickets/user/:userId", TicketController.getTicketByUserId as any);
app.get("/tickets/status/:status", TicketController.getTicketByStatus as any);
app.post("/tickets", TicketController.createTicket as any);
app.put("/tickets/:id", TicketController.updateTicket as any);
app.delete("/tickets/:id", TicketController.deleteTicket as any);

jest.mock("../../components/support-tickets/support-tickets.service");

beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
});

const mockTicket = {
    ticketId: 1,
    userId: 1,
    subject: "Issue with booking",
    message: "I can't book a room",
    status: "Open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

describe("Support Ticket Controller - Integration Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("GET /tickets should return all tickets", async () => {
        (TicketService.getAllTickets as jest.Mock).mockResolvedValue([mockTicket]);

        const res = await request(app).get("/tickets");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([mockTicket]);
    });

    test("GET /tickets/:id should return a ticket", async () => {
        (TicketService.getTicketById as jest.Mock).mockResolvedValue(mockTicket);

        const res = await request(app).get("/tickets/1");
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockTicket);
    });

    test("GET /tickets/:id should return 404 if not found", async () => {
        (TicketService.getTicketById as jest.Mock).mockResolvedValue(null);

        const res = await request(app).get("/tickets/99");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Ticket not found" });
    });

    test("GET /tickets/user/:userId should return ticket by userId", async () => {
        (TicketService.getTicketByUserId as jest.Mock).mockResolvedValue(mockTicket);

        const res = await request(app).get("/tickets/user/1");
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockTicket);
    });

    test("GET /tickets/user/:userId should return 404 if not found", async () => {
        (TicketService.getTicketByUserId as jest.Mock).mockResolvedValue(null);

        const res = await request(app).get("/tickets/user/100");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Ticket not found for user" });
    });

    test("GET /tickets/status/:status should return ticket by status", async () => {
        (TicketService.getTicketByStatus as jest.Mock).mockResolvedValue(mockTicket);

        const res = await request(app).get("/tickets/status/Open");
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockTicket);
    });

    test("GET /tickets/status/:status should return 400 for invalid status", async () => {
        const res = await request(app).get("/tickets/status/unknown");
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: "Invalid status value" });
    });

    test("GET /tickets/status/:status should return 404 if no tickets found", async () => {
        (TicketService.getTicketByStatus as jest.Mock).mockResolvedValue(null);

        const res = await request(app).get("/tickets/status/Closed");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "No tickets found for this status" });
    });

    test("POST /tickets should create a ticket", async () => {
        (TicketService.createTicket as jest.Mock).mockResolvedValue(mockTicket);

        const res = await request(app).post("/tickets").send(mockTicket);
        expect(res.status).toBe(201);
        expect(res.body).toEqual(mockTicket);
    });

    test("PUT /tickets/:id should update ticket", async () => {
        (TicketService.getTicketById as jest.Mock).mockResolvedValue(mockTicket);
        (TicketService.updateTicket as jest.Mock).mockResolvedValue({ ...mockTicket, status: "Resolved" });

        const res = await request(app).put("/tickets/1").send({ status: "Resolved" });
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("Resolved");
    });

    test("PUT /tickets/:id should return 404 if ticket not found", async () => {
        (TicketService.getTicketById as jest.Mock).mockResolvedValue(null);

        const res = await request(app).put("/tickets/99").send({ status: "Resolved" });
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Ticket not found" });
    });

    test("DELETE /tickets/:id should delete ticket", async () => {
        (TicketService.getTicketById as jest.Mock).mockResolvedValue(mockTicket);
        (TicketService.deleteTicket as jest.Mock).mockResolvedValue(undefined);

        const res = await request(app).delete("/tickets/1");
        expect(res.status).toBe(204);
    });

    test("DELETE /tickets/:id should return 404 if not found", async () => {
        (TicketService.getTicketById as jest.Mock).mockResolvedValue(null);

        const res = await request(app).delete("/tickets/99");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Ticket not found" });
    });

    test("GET /tickets should return 500 if not found", async () => {
        (TicketService.getAllTickets as jest.Mock).mockRejectedValue(new Error("DB error"));

        const res = await request(app).get("/tickets");
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Failed to fetch tickets" });
    });
});
