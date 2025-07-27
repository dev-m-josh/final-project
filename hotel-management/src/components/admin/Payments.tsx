import React, { useState, useEffect } from "react";
import { useAppSelector } from "../../hooks/redux.ts";
import type { PaymentType } from "../../features/paymentSlice";
import {
    deletePayment,
    fetchPayments,
} from "../../features/paymentSlice.ts";

import PaymentTable from "./PaymentTable.tsx";
import { X } from "lucide-react"
import { useDispatch } from "react-redux";

const Payments: React.FC = () => {
    const dispatch = useDispatch();
    const { payments, loading, error } = useAppSelector((state) => state.payments);
    const [viewPayment, setViewPayment] = useState<PaymentType | null>(null);

    useEffect(() => {
        dispatch(fetchPayments());
    }, [dispatch]);

    const handleViewPayment = (payment: PaymentType) => {
        setViewPayment(payment);
    }

    const handleDeletePayment = async (paymentId: number) => {
        if (window.confirm("Are you sure you want to delete this payment statement?")) {
            await dispatch(deletePayment(paymentId));
        }
    }

    const handleCloseView = () => {
        setViewPayment(null);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Payment Reports</h1>
                    <p className="mt-1 text-gray-600">Manage Payment Reports and issues</p>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="text-red-800">{error}</div>
                </div>
            )}

            {/* Payment Table */}
            <PaymentTable
                payments={payments}
                loading={loading}
                onView={handleViewPayment}
                onDelete={handleDeletePayment}
            />

            {/* View Payment Modal */}
            {viewPayment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-600 bg-opacity-75">
                    <div className="w-full max-w-2xl overflow-y-auto bg-white rounded-lg shadow-xl max-h-90vh">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">
                                Payment Details - #{viewPayment.paymentId}
                            </h3>
                            <button
                                onClick={handleCloseView}
                                className="cursor-pointer text-gray-400 transition-colors duration-150 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <h4 className="mb-2 text-sm font-medium tracking-wider text-gray-500 uppercase">
                                        Payment Information
                                    </h4>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-sm font-medium text-gray-900">Payment ID:</span>
                                            <span className="ml-2 text-sm text-gray-600">#{viewPayment.paymentId}</span>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-900">Booking ID:</span>
                                            <span className="ml-2 text-sm text-gray-600">#{viewPayment.bookingId}</span>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-900">User ID:</span>
                                            <span className="ml-2 text-sm text-gray-600">#{viewPayment.userId}</span>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-900">Transaction ID:</span>
                                            <span className="ml-2 text-sm text-gray-600">
                                                #{viewPayment.transactionId}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-900">Status:</span>
                                            <span
                                                className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    viewPayment.isPaid
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {viewPayment.isPaid ? "Paid" : "Not Paid"}{" "}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="mb-2 text-sm font-medium tracking-wider text-gray-500 uppercase">
                                        Timeline
                                    </h4>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-sm font-medium text-gray-900">Created:</span>
                                            <span className="ml-2 text-sm text-gray-600">
                                                {new Date(viewPayment.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-900">Last Updated:</span>
                                            <span className="ml-2 text-sm text-gray-600">
                                                {new Date(viewPayment.updatedAt).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 space-x-3 border-t border-gray-200">
                                <button
                                    onClick={handleCloseView}
                                    className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-150 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payments;
