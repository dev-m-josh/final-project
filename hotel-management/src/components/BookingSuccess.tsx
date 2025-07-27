import React from "react";
import { CheckCircle, Calendar, MapPin, Phone, Mail, X } from "lucide-react";
import type { HotelType } from "../features/hotelsAuth"
import { useNavigate } from 'react-router-dom';

interface BookingSuccessProps {
    hotel: HotelType;
    bookingDetails: {
        guestName: string;
        email: string;
        checkInDate: string;
        checkOutDate: string;
        guests: number;
        roomType: string;
        totalAmount: number;
    };
    onClose: () => void;
}

const BookingSuccess: React.FC<BookingSuccessProps> = ({ hotel, bookingDetails, onClose }) => {
    const navigate = useNavigate();
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const calculateNights = () => {
        const checkIn = new Date(bookingDetails.checkInDate);
        const checkOut = new Date(bookingDetails.checkOutDate);
        const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const bookingId = Math.floor(Math.random() * 1000000) + 100000;

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

                {/* Success Header */}
                <div className="p-8 text-center text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-t-2xl">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white rounded-full">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="mb-2 text-3xl font-bold">Booking Confirmed!</h2>
                    <p className="text-green-100">Your reservation has been successfully processed</p>
                    <div className="inline-block p-3 mt-4 rounded-lg bg-white/20">
                        <p className="text-sm">Booking Reference</p>
                        <p className="text-xl font-bold">#{bookingId}</p>
                    </div>
                </div>

                {/* Booking Details */}
                <div className="p-8">
                    {/* Hotel Information */}
                    <div className="mb-8">
                        <h3 className="mb-4 text-xl font-semibold text-gray-900">Hotel Details</h3>
                        <div className="flex items-start p-4 space-x-4 rounded-lg bg-gray-50">
                            <img
                                src={
                                    hotel.imageUrl ||
                                    "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=100"
                                }
                                alt={hotel.name}
                                className="object-cover w-20 h-20 rounded-lg"
                            />
                            <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-900">{hotel.name}</h4>
                                <div className="flex items-center mt-1 text-gray-600">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    <span className="text-sm">{hotel.location}</span>
                                </div>
                                <div className="flex items-center mt-1 text-gray-600">
                                    <Phone className="w-4 h-4 mr-1" />
                                    <span className="text-sm">{hotel.contactPhone}</span>
                                </div>
                                <span className="inline-block px-2 py-1 mt-2 text-xs font-semibold text-blue-800 bg-blue-100 rounded">
                                    {hotel.category}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Reservation Details */}
                    <div className="grid gap-6 mb-8 md:grid-cols-2">
                        <div>
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Guest Information</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">Guest Name</p>
                                    <p className="font-medium text-gray-900">{bookingDetails.guestName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="font-medium text-gray-900">{bookingDetails.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Number of Guests</p>
                                    <p className="font-medium text-gray-900">{bookingDetails.guests}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Stay Details</h3>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">Check-in</p>
                                        <p className="font-medium text-gray-900">
                                            {formatDate(bookingDetails.checkInDate)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">Check-out</p>
                                        <p className="font-medium text-gray-900">
                                            {formatDate(bookingDetails.checkOutDate)}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Room Type</p>
                                    <p className="font-medium text-gray-900">{bookingDetails.roomType}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="p-6 mb-8 rounded-lg bg-blue-50">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Payment Summary</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Duration:</span>
                                <span className="font-medium">
                                    {calculateNights()} night{calculateNights() > 1 ? "s" : ""}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Room Type:</span>
                                <span className="font-medium">{bookingDetails.roomType}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Guests:</span>
                                <span className="font-medium">{bookingDetails.guests}</span>
                            </div>
                            <div className="pt-2 mt-2 border-t border-blue-200">
                                <div className="flex justify-between text-lg font-bold text-gray-900">
                                    <span>Total Paid:</span>
                                    <span className="text-green-600">{formatCurrency(bookingDetails.totalAmount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="p-6 mb-6 rounded-lg bg-gray-50">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">What's Next?</h3>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                                <span>Confirmation email sent to {bookingDetails.email}</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                                <span>Hotel has been notified of your reservation</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                                <span>You can modify or cancel your booking up to 24 hours before check-in</span>
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                        <button className="flex items-center justify-center flex-1 px-6 py-3 font-semibold text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700">
                            <Mail className="w-5 h-5 mr-2"
                            onClick={() => navigate("/dashboard")}
                        />
                            Pay Now
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-3 font-semibold text-blue-600 transition-colors duration-200 border border-blue-600 rounded-lg hover:bg-blue-50"
                        >
                            Pay Later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccess;
