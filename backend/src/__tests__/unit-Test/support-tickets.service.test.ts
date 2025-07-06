import * as TicketService from "../../components/support-tickets/support-tickets.service";
import { db } from "../../drizzle/db";
import { SupportTicketsTable } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

jest.mock("../../drizzle/db", () => ({
    db: {
        select: jest.fn(),
        insert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));

beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
});

const mockTicket = {
    ticketId: 1,
    userId: 1,
    subject: "Issue with booking",
    message: "Can't book a room",
    status: "Open",
    createdAt: new Date(),
    updatedAt: new Date(),
};

beforeEach(() => {
    jest.clearAllMocks();

    // getAllTickets
    (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockResolvedValue([mockTicket]),
    });

    // insert (createTicket)
    (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([mockTicket]),
        }),
    });

    // update (updateTicket)
    (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValue([mockTicket]),
            }),
        }),
    });

    // delete (deleteTicket)
    (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockResolvedValue(undefined),
    });
});

describe("Support Ticket Service", () => {
    test("getAllTickets should return all tickets", async () => {
        const result = await TicketService.getAllTickets();
        expect(result).toEqual([mockTicket]);
    });

    test("getTicketById should return a single ticket", async () => {
        (db.select as jest.Mock).mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([mockTicket]),
            }),
        });

        const result = await TicketService.getTicketById(1);
        expect(result).toEqual(mockTicket);
    });

    test("getTicketById should return null if not found", async () => {
        (db.select as jest.Mock).mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([]),
            }),
        });

        const result = await TicketService.getTicketById(999);
        expect(result).toBeNull();
    });

    test("createTicket should insert and return new ticket", async () => {
        const { ticketId, message, status, ...rest } = mockTicket;
        const ticketData = {
            ...rest,
            description: message,
            status: status as "Open" | "In Progress" | "Resolved" | "Closed" | null | undefined
        };
        const result = await TicketService.createTicket(ticketData);
        expect(result).toEqual(mockTicket);
    });

    test("updateTicket should update and return ticket", async () => {
        const result = await TicketService.updateTicket(1, { status: "Resolved" });
        expect(result).toEqual(mockTicket);
    });

    test("deleteTicket should call db.delete().where()", async () => {
        const whereSpy = jest.fn().mockResolvedValue(undefined);
        (db.delete as jest.Mock).mockReturnValueOnce({ where: whereSpy });

        await TicketService.deleteTicket(1);
        expect(whereSpy).toHaveBeenCalled();
    });

    test("getTicketByUserId should return ticket by user ID", async () => {
        (db.select as jest.Mock).mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([mockTicket]),
            }),
        });

        const result = await TicketService.getTicketByUserId(1);
        expect(result).toEqual(mockTicket);
    });

    test("getTicketByUserId should return null if not found", async () => {
        (db.select as jest.Mock).mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([]),
            }),
        });

        const result = await TicketService.getTicketByUserId(100);
        expect(result).toBeNull();
    });

    test("getTicketByStatus should return ticket by status", async () => {
        (db.select as jest.Mock).mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([mockTicket]),
            }),
        });

        const result = await TicketService.getTicketByStatus("Open");
        expect(result).toEqual(mockTicket);
    });

    test("getTicketByStatus should return null if not found", async () => {
        (db.select as jest.Mock).mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([]),
            }),
        });

        const result = await TicketService.getTicketByStatus("Closed");
        expect(result).toBeNull();
    });
});
