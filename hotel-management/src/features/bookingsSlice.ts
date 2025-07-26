import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Booking type definition
export type BookingType = {
    bookingId: number;
    userId: number;
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    totalAmount: number;
    isConfirmed: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type NewBookingType = Omit<BookingType, "bookingId" | "createdAt" | "updatedAt">;
export type UpdateBookingType = Omit<BookingType, "createdAt" | "updatedAt">;

interface BookingState {
    bookings: BookingType[];
    allBookings: BookingType[];
    loading: boolean;
    error: string | null;
    selectedBooking?: BookingType | null;
}

const initialState: BookingState = {
    bookings: [],
    allBookings: [],
    loading: false,
    error: null,
    selectedBooking: null,
};

// Async Thunks
export const fetchBookings = createAsyncThunk("bookings/fetchBookings", async () => {
    const res = await fetch("https://final-project-api-q0ob.onrender.com/bookings");
    const data = await res.json();
    return data;
});

export const deleteBooking = createAsyncThunk("bookings/deleteBooking", async (bookingId: number) => {
    await fetch(`https://final-project-api-q0ob.onrender.com/bookings/delete/${bookingId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });
    return bookingId;
});

export const updateBooking = createAsyncThunk(
    "bookings/updateBooking",
    async (updatedBooking: UpdateBookingType, thunkAPI) => {
        try {
            const payload = {
                ...updatedBooking,
                checkInDate: new Date(updatedBooking.checkInDate),
                checkOutDate: new Date(updatedBooking.checkOutDate),
                updatedAt: new Date(),
            };

            const res = await fetch(`http://localhost:3000/bookings/update/${updatedBooking.bookingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to update booking");
            }

            return await res.json();
        } catch (err: unknown) {
            let message = "An unknown error occurred";
            if (err instanceof Error) message = err.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const addBooking = createAsyncThunk("bookings/addBooking", async (newBooking: NewBookingType, thunkAPI) => {
    try {
        const payload = {
            ...newBooking,
            checkInDate: new Date(newBooking.checkInDate),
            checkOutDate: new Date(newBooking.checkOutDate),
        };

        const res = await fetch("http://localhost:3000/bookings/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to add booking");
        }

        return await res.json();
    } catch (err: unknown) {
        let message = "An unknown error occurred";
        if (err instanceof Error) message = err.message;
        return thunkAPI.rejectWithValue(message);
    }
});


export const bookingDetails = createAsyncThunk("bookings/bookingDetails", async (bookingId: number, thunkAPI) => {
    try {
        const res = await fetch(`https://final-project-api-q0ob.onrender.com/bookings/details/${bookingId}`);
        if (!res.ok) throw new Error("Failed to fetch booking details");
        return await res.json();
    } catch (err: unknown) {
        let message = "An unknown error occurred";
        if (err instanceof Error) message = err.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const fetchBookingsByUserId = createAsyncThunk(
    "bookings/fetchBookingsByUserId",
    async (userId: string, thunkAPI) => {
        try {
            const res = await fetch(`http://localhost:3000/bookings/user/${userId}`);
            if (!res.ok) throw new Error("Failed to fetch bookings by user");
            return await res.json();
        } catch (err: unknown) {
            let message = "An unknown error occurred";
            if (err instanceof Error) message = err.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const fetchBookingsByStatus = createAsyncThunk(
    "bookings/fetchBookingsByStatus",
    async (status: boolean, thunkAPI) => {
        try {
            const res = await fetch(`https://final-project-api-q0ob.onrender.com/bookings/status/${status}`);
            if (!res.ok) throw new Error("Failed to fetch bookings by status");
            return await res.json();
        } catch (err: unknown) {
            let message = "An unknown error occurred";
            if (err instanceof Error) message = err.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const setIsconfirmedTrue = createAsyncThunk(
    "bookings/setIsconfirmedTrue",
    async (bookingId: number, thunkAPI) => {
        try {
            const res = await fetch(`http://localhost:3000/bookings/confirm/${bookingId}`);
            if (!res.ok) throw new Error("Failed to confirm booking");
            return await res.json();
        } catch (err: unknown) {
            let message = "An unknown error occurred";
            if (err instanceof Error) message = err.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
)

// Slice
const bookingSlice = createSlice({
    name: "bookings",
    initialState,
    reducers: {
        resetBookingFilter(state) {
            state.bookings = state.allBookings;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = action.payload;
                state.allBookings = action.payload;
            })
            .addCase(fetchBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch bookings.";
            })

            .addCase(deleteBooking.fulfilled, (state, action: PayloadAction<number>) => {
                state.bookings = state.bookings.filter((b) => b.bookingId !== action.payload);
            })

            .addCase(updateBooking.fulfilled, (state, action: PayloadAction<BookingType>) => {
                const index = state.bookings.findIndex((b) => b.bookingId === action.payload.bookingId);
                if (index !== -1) state.bookings[index] = action.payload;
            })

            .addCase(addBooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addBooking.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings.push(action.payload);
            })
            .addCase(addBooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(bookingDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(bookingDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedBooking = action.payload;
            })
            .addCase(bookingDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchBookingsByUserId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookingsByUserId.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = action.payload;
            })
            .addCase(fetchBookingsByUserId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchBookingsByStatus.fulfilled, (state, action) => {
                state.bookings = action.payload;
            })

            .addCase(setIsconfirmedTrue.fulfilled, (state, action) => {
                const index = state.bookings.findIndex((b) => b.bookingId === action.payload.bookingId);
                if (index !== -1) state.bookings[index] = action.payload;
            })

            .addCase(setIsconfirmedTrue.rejected, (state, action) => {
                state.error = action.payload as string;
            })
    },
});

export const { resetBookingFilter } = bookingSlice.actions;
export default bookingSlice.reducer;
