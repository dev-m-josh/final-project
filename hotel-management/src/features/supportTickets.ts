import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Types
export type SupportTicketStatus = "Open" | "In Progress" | "Resolved" | "Closed";

export type SupportTicketType = {
    ticketId: number;
    userId: number;
    subject: string;
    description: string;
    status: SupportTicketStatus;
    createdAt: string;
    updatedAt: string;
};

export type NewSupportTicketType = Omit<SupportTicketType, "ticketId" | "createdAt" | "updatedAt">;

export type UpdateSupportTicketType = Partial<Omit<SupportTicketType, "createdAt" | "updatedAt">> & {
    ticketId: number;
};

// State
interface SupportTicketState {
    tickets: SupportTicketType[];
    loading: boolean;
    error: string | null;
    selectedTicket?: SupportTicketType | null;
}

const initialState: SupportTicketState = {
    tickets: [],
    loading: false,
    error: null,
    selectedTicket: null,
};

// Async Thunks
export const fetchSupportTickets = createAsyncThunk("supportTickets/fetchAll", async () => {
    const res = await fetch("https://final-project-api-q0ob.onrender.com/support-tickets");
    if (!res.ok) throw new Error("Failed to fetch support tickets");
    return await res.json();
});

export const addSupportTicket = createAsyncThunk(
    "supportTickets/add",
    async (newTicket: NewSupportTicketType, thunkAPI) => {
        try {
            const res = await fetch("https://final-project-api-q0ob.onrender.com/support-tickets/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTicket),
            });
            if (!res.ok) throw new Error("Failed to add ticket");
            return await res.json();
        } catch (err) {
            return thunkAPI.rejectWithValue((err as Error).message);
        }
    }
);

export const updateSupportTicket = createAsyncThunk(
    "supportTickets/update",
    async (ticketUpdate: UpdateSupportTicketType, thunkAPI) => {
        try {
            const res = await fetch(
                `https://final-project-api-q0ob.onrender.com/support-tickets/update/${ticketUpdate.ticketId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(ticketUpdate),
                }
            );
            if (!res.ok) throw new Error("Failed to update ticket");
            return await res.json();
        } catch (err) {
            return thunkAPI.rejectWithValue((err as Error).message);
        }
    }
);

export const deleteSupportTicket = createAsyncThunk("supportTickets/delete", async (ticketId: number) => {
    await fetch(`https://final-project-api-q0ob.onrender.com/support-tickets/delete/${ticketId}`, {
        method: "DELETE",
    });
    return ticketId;
});

export const getSupportTicketDetails = createAsyncThunk(
    "supportTickets/details",
    async (ticketId: number, thunkAPI) => {
        try {
            const res = await fetch(`https://final-project-api-q0ob.onrender.com/support-tickets/details/${ticketId}`);
            if (!res.ok) throw new Error("Failed to fetch ticket details");
            return await res.json();
        } catch (err) {
            return thunkAPI.rejectWithValue((err as Error).message);
        }
    }
);

// Slice
const supportTicketSlice = createSlice({
    name: "supportTickets",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSupportTickets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSupportTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets = action.payload;
            })
            .addCase(fetchSupportTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch tickets";
            })

            .addCase(addSupportTicket.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addSupportTicket.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets.push(action.payload);
            })
            .addCase(addSupportTicket.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateSupportTicket.fulfilled, (state, action: PayloadAction<SupportTicketType>) => {
                const index = state.tickets.findIndex((t) => t.ticketId === action.payload.ticketId);
                if (index !== -1) state.tickets[index] = action.payload;
            })
            .addCase(updateSupportTicket.rejected, (state, action) => {
                state.error = action.payload as string;
            })

            .addCase(deleteSupportTicket.fulfilled, (state, action: PayloadAction<number>) => {
                state.tickets = state.tickets.filter((t) => t.ticketId !== action.payload);
            })

            .addCase(getSupportTicketDetails.fulfilled, (state, action: PayloadAction<SupportTicketType>) => {
                state.selectedTicket = action.payload;
            })
            .addCase(getSupportTicketDetails.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export default supportTicketSlice.reducer;
