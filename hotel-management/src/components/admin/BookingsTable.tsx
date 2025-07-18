import React from "react";
import { Plus, Search, Edit, Trash2, Calendar, DollarSign, User, CheckCircle, XCircle } from "lucide-react";
import type { BookingType } from "../../features/bookingsSlice";

interface BookingsTableProps {
    bookings: BookingType[];
    loading: boolean;
    error: string | null;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onAddClick: () => void;
    onEditClick: (booking: BookingType) => void;
    onDeleteClick: (bookingId: number) => void;
    onViewClick: (booking: BookingType) => void;
    onToggleStatus: (booking: BookingType) => void;
    onRetry: () => void;
}

const BookingsTable: React.FC<BookingsTableProps> = ({
    bookings,
    loading,
    error,
    searchTerm,
    onSearchChange,
    onAddClick,
    onEditClick,
    onDeleteClick,
    onViewClick,
    onToggleStatus,
    onRetry,
}) => {
    const filteredBookings = bookings.filter(
        (booking) =>
            booking.bookingId.toString().includes(searchTerm) ||
            booking.userId.toString().includes(searchTerm) ||
            booking.roomId.toString().includes(searchTerm)
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    // const renderStars = (rating: string) => {
    //     const numRating = parseFloat(rating) || 0;
    //     const stars = [];
    //     for (let i = 1; i <= 5; i++) {
    //         stars.push(
    //             <Star
    //                 key={i}
    //                 className={`h-3 w-3 ${i <= numRating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
    //             />
    //         );
    //     }
    //     return stars;
    // };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Booking Management</h2>
                    <button
                        onClick={onAddClick}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Booking
                    </button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search bookings by ID, User ID, or Room ID..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Bookings Table */}
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-600">Loading bookings...</p>
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-red-600">
                        <p>Error: {error}</p>
                        <button
                            onClick={onRetry}
                            className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Booking
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Guest
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Dates
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rating
                                </th> */}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredBookings.map((booking) => (
                                <tr key={booking.bookingId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                #{booking.bookingId}
                                            </div>
                                            <div className="text-sm text-gray-500">Room #{booking.roomId}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <User className="h-4 w-4 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-900">User #{booking.userId}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <div className="flex items-center text-sm text-gray-900">
                                                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                                {formatDate(booking.checkInDate)}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                                {formatDate(booking.checkOutDate)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm font-medium text-gray-900">
                                            <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                                            {formatCurrency(booking.totalAmount)}
                                        </div>
                                    </td>
                                    {/* <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {renderStars(booking.rating)}
                                            <span className="ml-1 text-sm text-gray-600">({booking.rating})</span>
                                        </div>
                                    </td> */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => onToggleStatus(booking)}
                                            className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-200 ${
                                                booking.isConfirmed
                                                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                                                    : "bg-red-100 text-red-800 hover:bg-red-200"
                                            }`}
                                        >
                                            {booking.isConfirmed ? (
                                                <>
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Confirmed
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="h-3 w-3 mr-1" />
                                                    Pending
                                                </>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => onViewClick(booking)}
                                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                title="View Details"
                                            >
                                                <Calendar className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => onEditClick(booking)}
                                                className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                                                title="Edit Booking"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => onDeleteClick(booking.bookingId)}
                                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                title="Delete Booking"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default BookingsTable;
