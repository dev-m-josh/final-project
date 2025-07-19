import React from "react";
import { X, Calendar, DollarSign, User, CheckCircle, XCircle, MapPin } from "lucide-react";
import type { BookingType } from "../../features/bookingsSlice";

interface BookingDetailsProps {
    booking: BookingType;
    onClose: () => void;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ booking, onClose }) => {
    const formatDate = (dateString: string) => {
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

    const calculateNights = () => {
        const checkIn = new Date(booking.checkInDate);
        const checkOut = new Date(booking.checkOutDate);
        const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute z-10 p-2 transition-colors duration-200 bg-white rounded-full shadow-lg top-4 right-4 hover:bg-gray-100"
                >
                    <X className="w-5 h-5 text-gray-600" />
                </button>

                {/* Header */}
                <div
                    className={`p-8 rounded-t-2xl ${
                        booking.isConfirmed
                           ? "bg-gradient-to-r from-green-600 to-emerald-600"
                           : "bg-gradient-to-r from-orange-600 to-red-600"
                    }`}
                >
                    <div className="flex items-center justify-between text-white">
                        <div>
                            <h2 className="text-2xl font-bold">Booking #{booking.bookingId}</h2>
                            <p className="text-blue-100">Room #{booking.roomId}</p>
                        </div>
                        <div className="text-right">
                            <div
                                className={`flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                                    booking.isConfirmed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                            >
                                {booking.isConfirmed ? (
                                    <>
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        Confirmed
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-4 h-4 mr-1" />
                                        Pending
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Details */}
                <div className="p-8">
                    <div className="grid gap-6 mb-8 md:grid-cols-2">
                        <div>
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Guest Information</h3>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <User className="w-5 h-5 mr-3 text-blue-600" />
                                    <div>
                                        <p className="font-medium text-gray-900">Guest ID</p>
                                        <p className="text-gray-600">#{booking.userId}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Stay Details</h3>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                                    <div>
                                        <p className="font-medium text-gray-900">Room</p>
                                        <p className="text-gray-600">Room #{booking.roomId}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                                    <div>
                                        <p className="font-medium text-gray-900">Duration</p>
                                        <p className="text-gray-600">{calculateNights()} night(s)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 mb-8 md:grid-cols-2">
                        <div>
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Check-in & Check-out</h3>
                            <div className="space-y-3">
                                <div className="flex items-start">
                                    <Calendar className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">Check-in</p>
                                        <p className="text-gray-600">{formatDate(booking.checkInDate)}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Calendar className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">Check-out</p>
                                        <p className="text-gray-600">{formatDate(booking.checkOutDate)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Payment & Rating</h3>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <DollarSign className="w-5 h-5 mr-3 text-green-600" />
                                    <div>
                                        <p className="font-medium text-gray-900">Total Amount</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            {formatCurrency(booking.totalAmount)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Booking Timeline</h3>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                                <div>
                                    <p className="font-medium text-gray-900">Booking Created</p>
                                    <p className="text-gray-600">{formatDate(booking.createdAt)}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                                <div>
                                    <p className="font-medium text-gray-900">Last Updated</p>
                                    <p className="text-gray-600">{formatDate(booking.updatedAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex pt-6 mt-8 space-x-4 border-t">
                        <button className="flex items-center justify-center flex-1 px-6 py-3 font-semibold text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700">
                            <Calendar className="w-5 h-5 mr-2" />
                            Modify Booking
                        </button>
                        <button className="px-6 py-3 font-semibold text-blue-600 transition-colors duration-200 border border-blue-600 rounded-lg hover:bg-blue-50">
                            Contact Guest
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetails;
