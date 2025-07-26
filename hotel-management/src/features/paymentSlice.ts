import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Payment type definition
export type PaymentType = {
    paymentId: number;
    bookingId: number;
    userId: number;
    amount: string;
    isPaid: boolean;
    paymentMethod: string;
    transactionId: string;
    paymentDate: string | null;
    createdAt: string;
    updatedAt: string;
};

export type NewPaymentType = Omit<PaymentType, "paymentId" | "createdAt" | "updatedAt">;
export type UpdatePaymentType = Omit<PaymentType, "createdAt" | "updatedAt">;

interface PaymentState {
    payments: PaymentType[];
    allPayments: PaymentType[];
    loading: boolean;
    error: string | null;
    selectedPayment?: PaymentType | null;
}

const initialState: PaymentState = {
    payments: [],
    allPayments: [],
    loading: false,
    error: null,
    selectedPayment: null,
};

// Async Thunks
export const fetchPayments = createAsyncThunk("payments/fetchPayments", async () => {
    const res = await fetch("https://final-project-api-q0ob.onrender.com/payments");
    if (!res.ok) throw new Error("Failed to fetch payments");
    return await res.json();
});

export const deletePayment = createAsyncThunk("payments/deletePayment", async (paymentId: number) => {
    await fetch(`https://final-project-api-q0ob.onrender.com/payments/delete/${paymentId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });
    return paymentId;
});

export const updatePayment = createAsyncThunk(
    "payments/updatePayment",
    async (updatedPayment: UpdatePaymentType, thunkAPI) => {
        try {
            const payload = {
                ...updatedPayment,
                updatedAt: new Date(),
                paymentDate: updatedPayment.paymentDate ? new Date(updatedPayment.paymentDate) : null,
            };

            const res = await fetch(`http://localhost:3000/payments/update/${updatedPayment.paymentId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to update payment");
            }

            return await res.json();
        } catch (err: unknown) {
            let message = "An unknown error occurred";
            if (err instanceof Error) message = err.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const addPayment = createAsyncThunk("payments/addPayment", async (newPayment: NewPaymentType, thunkAPI) => {
    try {
        const payload = {
            newPayment
        };

        const res = await fetch("http://localhost:3000/payments/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to add payment");
        }

        return await res.json();
    } catch (err: unknown) {
        let message = "An unknown error occurred";
        if (err instanceof Error) message = err.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const paymentDetails = createAsyncThunk("payments/paymentDetails", async (paymentId: number, thunkAPI) => {
    try {
        const res = await fetch(`https://final-project-api-q0ob.onrender.com/payments/details/${paymentId}`);
        if (!res.ok) throw new Error("Failed to fetch payment details");
        return await res.json();
    } catch (err: unknown) {
        let message = "An unknown error occurred";
        if (err instanceof Error) message = err.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Slice
const paymentSlice = createSlice({
    name: "payments",
    initialState,
    reducers: {
        resetPaymentFilter(state) {
            state.payments = state.allPayments;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPayments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPayments.fulfilled, (state, action) => {
                state.loading = false;
                state.payments = action.payload;
                state.allPayments = action.payload;
            })
            .addCase(fetchPayments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch payments.";
            })

            .addCase(deletePayment.fulfilled, (state, action: PayloadAction<number>) => {
                state.payments = state.payments.filter((p) => p.paymentId !== action.payload);
            })

            .addCase(updatePayment.fulfilled, (state, action: PayloadAction<PaymentType>) => {
                const index = state.payments.findIndex((p) => p.paymentId === action.payload.paymentId);
                if (index !== -1) state.payments[index] = action.payload;
            })

            .addCase(addPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.payments.push(action.payload);
            })
            .addCase(addPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(paymentDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(paymentDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedPayment = action.payload;
            })
            .addCase(paymentDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetPaymentFilter } = paymentSlice.actions;
export default paymentSlice.reducer;
