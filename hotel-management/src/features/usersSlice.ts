import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// User type definition
export type UserType = {
    userId: number;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    contactPhone: string;
    address: string;
    isAdmin: string;
    verificationCode: string;
    isVerified: string;
    createdAt: Date;
    updatedAt: Date;
};

export type NewUserType = Omit<UserType, "userId" | "createdAt" | "updatedAt">;
export type UpdateUserType = Omit<UserType, "createdAt" | "updatedAt">;

interface UserState {
    users: UserType[];
    allUsers: UserType[];
    loading: boolean;
    error: string | null;
    selectedUser?: UserType | null;
}

const initialState: UserState = {
    users: [],
    allUsers: [],
    loading: false,
    error: null,
    selectedUser: null,
};

// -------------------- Async Thunks --------------------

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
    const res = await fetch("https://final-project-api-q0ob.onrender.com/users");
    const data = await res.json();
    return data;
});

export const deleteUser = createAsyncThunk("users/deleteUser", async (userId: number) => {
    await fetch(`https://final-project-api-q0ob.onrender.com/users/delete/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });
    return userId;
});

export const updateUser = createAsyncThunk("users/updateUser", async (updatedUser: UpdateUserType, thunkAPI) => {
    try {
        const payload = {
            ...updatedUser,
            updatedAt: new Date(),
        };

        const res = await fetch(`https://final-project-api-q0ob.onrender.com/users/update/${updatedUser.userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to update user");
        }

        return await res.json();
    } catch (err: unknown) {
        return thunkAPI.rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
});


export const addUser = createAsyncThunk("users/addUser", async (newUser: NewUserType, thunkAPI) => {
    try {
        const res = await fetch("https://final-project-api-q0ob.onrender.com/users/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...newUser,
                createdAt: new Date(),
                updatedAt: new Date(),
            }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to add user");
        }

        return await res.json();
    } catch (err: unknown) {
        let message = "An unknown error occurred";
        if (err instanceof Error) message = err.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const userDetails = createAsyncThunk("users/userDetails", async (userId: number, thunkAPI) => {
    try {
        const res = await fetch(`https://final-project-api-q0ob.onrender.com/users/details/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch user details");
        return await res.json();
    } catch (err: unknown) {
        let message = "An unknown error occurred";
        if (err instanceof Error) message = err.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// -------------------- Slice --------------------

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        resetUserFilter(state) {
            state.users = state.allUsers;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
                state.allUsers = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch users.";
            })

            .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
                state.users = state.users.filter((u) => u.userId !== action.payload);
            })

            .addCase(updateUser.fulfilled, (state, action: PayloadAction<UserType>) => {
                const index = state.users.findIndex((u) => u.userId === action.payload.userId);
                if (index !== -1) state.users[index] = action.payload;
            })

            .addCase(addUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(userDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedUser = action.payload;
            })
            .addCase(userDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetUserFilter } = usersSlice.actions;
export default usersSlice.reducer;
