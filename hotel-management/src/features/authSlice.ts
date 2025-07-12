// Importing necessary functions and types from Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Defining the shape of the user object stored in the state
interface User {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    contactPhone: string;
    address: string;
    token: string;
    verificationCode: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    isAdmin: boolean;
}

// Defining the shape of the authentication state
interface AuthState {
    user: User | null; // Will be null if not logged in
}

// Initialize the auth state by checking if a user is stored in localStorage
const initialState: AuthState = {
    user: JSON.parse(localStorage.getItem("myUser") || "null"), // Parse user from localStorage or null
};

// Create a Redux slice for authentication logic
const authSlice = createSlice({
    name: "auth", // Name of the slice
    initialState, // Initial state for the slice
    reducers: {
        // Action to log the user in
        login(state, action: PayloadAction<User>) {
            state.user = action.payload; // Set user state with the payload
            // Save user and token in localStorage for persistence across reloads
            localStorage.setItem("myUser", JSON.stringify(action.payload));
            localStorage.setItem("myToken", action.payload.token);
        },
        // Action to log the user out
        logout(state) {
            state.user = null; // Clear user from state
            // Remove user and token from localStorage
            localStorage.removeItem("myUser");
            localStorage.removeItem("myToken");
        },
    },
});

// Exporting the login and logout actions
export const { login, logout } = authSlice.actions;

// Exporting the reducer to be used in the store
export default authSlice.reducer;
