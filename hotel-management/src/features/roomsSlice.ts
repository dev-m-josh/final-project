import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type RoomType = {
    roomId: number;
    hotelId: number;
    roomType: string;
    pricePerNight: string;
    capacity: number;
    amenities: string;
    isAvailable: boolean;
    createdAt: string;
};

export type NewRoomType = Omit<RoomType, "roomId" | "createdAt">;
export type UpdateRoomType = Omit<RoomType, "createdAt">;

interface RoomState {
    rooms: RoomType[];
    allRooms: RoomType[];
    loading: boolean;
    error: string | null;
    selectedRoom?: RoomType | null;
}

const initialState: RoomState = {
    rooms: [],
    allRooms: [],
    loading: false,
    error: null,
    selectedRoom: null,
};

export const fetchRooms = createAsyncThunk("rooms/fetchRooms", async () => {
    const res = await fetch("https://final-project-api-q0ob.onrender.com/rooms");
    const data = await res.json();
    return data;
});

export const deleteRoom = createAsyncThunk("rooms/deleteRoom", async (roomId: number) => {
    await fetch(`https://final-project-api-q0ob.onrender.com/rooms/delete/${roomId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });
    return roomId;
});

export const updateRoom = createAsyncThunk("rooms/updateRoom", async (updatedRoom: UpdateRoomType) => {
    const res = await fetch(`https://final-project-api-q0ob.onrender.com/rooms/update/${updatedRoom.roomId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRoom),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update room");
    }

    return await res.json();
});

export const addRoom = createAsyncThunk("rooms/addRoom", async (newRoom: NewRoomType, thunkAPI) => {
    try {
        const res = await fetch("https://final-project-api-q0ob.onrender.com/rooms/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newRoom),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to add room");
        }
        return await res.json();
    } catch (err: unknown) {
        let message = "An unknown error occurred";
        if (err instanceof Error) message = err.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const roomDetails = createAsyncThunk("rooms/roomDetails", async (roomId: number, thunkAPI) => {
    try {
        const res = await fetch(`https://final-project-api-q0ob.onrender.com/rooms/details/${roomId}`);
        if (!res.ok) throw new Error("Failed to fetch room details");
        return await res.json();
    } catch (err: unknown) {
        let message = "An unknown error occurred";
        if (err instanceof Error) message = err.message;
        return thunkAPI.rejectWithValue(message);
    }
});


const roomsSlice = createSlice({
    name: "rooms",
    initialState,
    reducers: {
        resetRoomFilter(state) {
            state.rooms = state.allRooms;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRooms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRooms.fulfilled, (state, action) => {
                state.loading = false;
                state.rooms = action.payload;
                state.allRooms = action.payload;
            })
            .addCase(fetchRooms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch rooms.";
            })

            .addCase(deleteRoom.fulfilled, (state, action: PayloadAction<number>) => {
                state.rooms = state.rooms.filter((r) => r.roomId !== action.payload);
            })

            .addCase(updateRoom.fulfilled, (state, action: PayloadAction<RoomType>) => {
                const index = state.rooms.findIndex((r) => r.roomId === action.payload.roomId);
                if (index !== -1) state.rooms[index] = action.payload;
            })

            .addCase(addRoom.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addRoom.fulfilled, (state, action) => {
                state.loading = false;
                state.rooms.push(action.payload);
            })
            .addCase(addRoom.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(roomDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(roomDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedRoom = action.payload;
            })
            .addCase(roomDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetRoomFilter } = roomsSlice.actions;
export default roomsSlice.reducer;
