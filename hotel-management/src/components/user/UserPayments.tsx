import React from "react";
import { CreditCard, Calendar, DollarSign, CheckCircle, XCircle } from "lucide-react";
import type { PaymentType } from "../../features/paymentSlice";

interface UserPaymentsProps {
    payments: PaymentType[];
    loading: boolean;
    error: string | null;
}

const UserPayments: React.FC<UserPaymentsProps> = ({ payments, loading, error }) => {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const getPaymentStatusColor = (isPaid: boolean) => {
        return isPaid ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200";
    };

    const getPaymentStatusIcon = (isPaid: boolean) => {
        return isPaid ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading your payments...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (payments.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No payments yet</h3>
                <p className="text-gray-600 mb-6">Your payment history will appear here once you make bookings.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {payments.map((payment) => (
                <div
                    key={payment.paymentId}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Payment #{payment.paymentId}</h3>
                                <p className="text-gray-600">Booking #{payment.bookingId}</p>
                            </div>
                            <div
                                className={`flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPaymentStatusColor(
                                    payment.isPaid
                                )}`}
                            >
                                {getPaymentStatusIcon(payment.isPaid)}
                                <span className="ml-1">{payment.isPaid ? "Paid" : "Pending"}</span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 mb-6">
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Amount</h4>
                                <div className="flex items-center text-gray-600">
                                    <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                                    <span className="text-lg font-semibold text-gray-900">
                                        {formatCurrency(payment.amount)}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Payment Method</h4>
                                <div className="flex items-center text-gray-600">
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    <span className="capitalize">{payment.paymentMethod.replace("_", " ")}</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Payment Date</h4>
                                <div className="flex items-center text-gray-600">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <span>{formatDate(payment.paymentDate)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Transaction ID:</span>
                                    <span className="ml-2 font-mono text-gray-900">{payment.transactionId}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Created:</span>
                                    <span className="ml-2 text-gray-900">{formatDate(payment.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserPayments;
