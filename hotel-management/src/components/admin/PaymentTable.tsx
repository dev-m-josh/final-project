// PaymentTable.tsx
import React from "react";
import type { PaymentType } from "../../features/paymentSlice";
import { Trash2, Eye } from "lucide-react";

interface Props {
    payments: PaymentType[];
    loading: boolean;
    onView: (payment: PaymentType) => void;
    onDelete: (id: number) => void;
}

const PaymentTable: React.FC<Props> = ({ payments, loading, onView, onDelete }) => {

        if (loading) {
            return (
                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="animate-pulse">
                        <div className="h-8 mb-4 bg-gray-200 rounded"></div>
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-12 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }
    
    return (
        <div>
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2">Payment ID</th>
                            <th className="px-4 py-2">User ID</th>
                            <th className="px-4 py-2">Booking ID</th>
                            <th className="px-4 py-2">Amount</th>
                            <th className="px-4 py-2">Paid</th>
                            <th className="px-4 py-2">Method</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-4 text-center">
                                    Loading...
                                </td>
                            </tr>
                        ) : payments.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-4 text-center">
                                    No payments found.
                                </td>
                            </tr>
                        ) : (
                            payments.map((payment) => (
                                <tr key={payment.paymentId} className="border-t">
                                    <td className="px-4 py-2">{payment.paymentId}</td>
                                    <td className="px-4 py-2">{payment.userId}</td>
                                    <td className="px-4 py-2">{payment.bookingId}</td>
                                    <td className="px-4 py-2">${payment.amount}</td>
                                    <td className="px-4 py-2">{payment.isPaid ? "Yes" : "No"}</td>
                                    <td className="px-4 py-2">{payment.paymentMethod}</td>
                                    <td className="px-4 py-2 space-x-2">
                                        <button
                                            onClick={() => onView(payment)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(payment.paymentId)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentTable;
