import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Hotel type definition
export type HotelType = {
    hotelId: number;
    name: string;
    imageUrl: string;
    location: string;
    address: string;
    contactPhone: string;
    category: string;
    rating: string;
    createdAt: string;
    updatedAt: string;
};

export type NewHotelType = Omit<HotelType, "hotelId">;

interface HotelState {
    hotels: HotelType[];
    allHotels: HotelType[];
    loading: boolean;
    error: string | null;
    selectedHotel?: HotelType | null;
}

const initialState: HotelState = {
    hotels: [],
    allHotels: [],
    loading: false,
    error: null,
    selectedHotel: null,
};

// Async Thunks
export const fetchHotels = createAsyncThunk("hotels/fetchHotels", async () => {
    const res = await fetch("https://final-project-api-q0ob.onrender.com/hotel");
    const data = await res.json();
    return data;
});

export const deleteHotel = createAsyncThunk("hotels/deleteHotel", async (hotelId: number) => {
    await fetch(`https://final-project-api-q0ob.onrender.com/hotel/${hotelId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });
    return hotelId;
});

export const updateHotel = createAsyncThunk("hotels/updateHotel", async (updatedHotel: HotelType) => {
    const res = await fetch(`https://final-project-api-q0ob.onrender.com/hotel/${updatedHotel.hotelId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedHotel),
    });
    return await res.json();
});

export const addHotel = createAsyncThunk("hotels/addHotel", async (newHotel: NewHotelType, thunkAPI) => {
    try {
        const res = await fetch("https://final-project-api-q0ob.onrender.com/hotel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newHotel),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to add hotel");
        }
        return await res.json();
    } catch (err: unknown) {
        let message = "An unknown error occurred";
        if (err instanceof Error) message = err.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const hotelDetails = createAsyncThunk("hotels/hotelDetails", async (hotelId: number, thunkAPI) => {
    try {
        const res = await fetch(`https://final-project-api-q0ob.onrender.com/hotel/${hotelId}`);
        if (!res.ok) throw new Error("Failed to fetch hotel details");
        return await res.json();
    } catch (err: unknown) {
        let message = "An unknown error occurred";
        if (err instanceof Error) message = err.message;
        return thunkAPI.rejectWithValue(message);
    }
});
export const fetchHotelsByLocation = createAsyncThunk(
    "hotels/fetchHotelsByLocation",
    async (location: string, thunkAPI) => {
        try {
            const res = await fetch(`https://final-project-api-q0ob.onrender.com/hotel/location/${location}`);
            if (!res.ok) throw new Error("Failed to fetch hotels by location");
            return await res.json();
        } catch (err: unknown) {
            let message = "An unknown error occurred";
            if (err instanceof Error) message = err.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
const hotelSlice = createSlice({
    name: "hotels",
    initialState,
    reducers: {
        resetHotelFilter(state) {
            state.hotels = state.allHotels;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHotels.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHotels.fulfilled, (state, action) => {
                state.loading = false;
                state.hotels = action.payload;
                state.allHotels = action.payload;
            })
            .addCase(fetchHotels.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch hotels.";
            })

            .addCase(deleteHotel.fulfilled, (state, action: PayloadAction<number>) => {
                state.hotels = state.hotels.filter((h) => h.hotelId !== action.payload);
            })

            .addCase(updateHotel.fulfilled, (state, action: PayloadAction<HotelType>) => {
                const index = state.hotels.findIndex((h) => h.hotelId === action.payload.hotelId);
                if (index !== -1) state.hotels[index] = action.payload;
            })

            .addCase(addHotel.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addHotel.fulfilled, (state, action) => {
                state.loading = false;
                state.hotels.push(action.payload);
            })
            .addCase(addHotel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(hotelDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(hotelDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedHotel = action.payload;
            })
            .addCase(hotelDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchHotelsByLocation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHotelsByLocation.fulfilled, (state, action) => {
                state.loading = false;
                state.hotels = action.payload; // Replace current hotels with filtered results
            })
            .addCase(fetchHotelsByLocation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetHotelFilter } = hotelSlice.actions;
export default hotelSlice.reducer;
