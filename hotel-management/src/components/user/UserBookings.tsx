import { Calendar, CreditCard, CheckCircle, Clock, DollarSign } from "lucide-react";
import type { BookingType } from "../../features/bookingsSlice";

interface UserBookingsProps {
    bookings: BookingType[];
    loading: boolean;
    error: string | null;
    onMakePayment: (booking: BookingType) => void;
}

const UserBookings: React.FC<UserBookingsProps> = ({ bookings, loading, error, onMakePayment }) => {
    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);

    const calculateNights = (checkIn: string, checkOut: string) => {
        const inDate = new Date(checkIn);
        const outDate = new Date(checkOut);
        const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getStatusColor = (isConfirmed: boolean) =>
        isConfirmed
            ? "bg-green-100 text-green-800 border-green-200"
            : "bg-orange-100 text-orange-800 border-orange-200";

    const getStatusIcon = (isConfirmed: boolean) =>
        isConfirmed ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />;

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading your bookings...</p>
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

    if (bookings.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-600 mb-6">Start planning your next trip by browsing our hotels.</p>
                <a
                    href="/hotels"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                    Browse Hotels
                </a>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {bookings.map((booking) => (
                <div
                    key={booking.bookingId}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Booking #{booking.bookingId}</h3>
                                <p className="text-gray-600">Room #{booking.roomId}</p>
                            </div>
                            <div
                                className={`flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                                    booking.isConfirmed
                                )}`}
                            >
                                {getStatusIcon(booking.isConfirmed)}
                                <span className="ml-1">{booking.isConfirmed ? "Confirmed" : "Pending Payment"}</span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 mb-6">
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Check-in</h4>
                                <div className="flex items-center text-gray-600">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <span>{formatDate(booking.checkInDate)}</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Check-out</h4>
                                <div className="flex items-center text-gray-600">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <span>{formatDate(booking.checkOutDate)}</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Duration</h4>
                                <div className="flex items-center text-gray-600">
                                    <Clock className="h-4 w-4 mr-2" />
                                    <span>
                                        {calculateNights(booking.checkInDate, booking.checkOutDate)} night
                                        {calculateNights(booking.checkInDate, booking.checkOutDate) > 1 ? "s" : ""}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                            <div className="flex items-center">
                                <DollarSign className="h-5 w-5 text-green-600 mr-1" />
                                <span className="text-xl font-bold text-gray-900">
                                    {formatCurrency(booking.totalAmount)}
                                </span>
                            </div>

                            {!booking.isConfirmed ? (
                                <button
                                    onClick={() => onMakePayment(booking)}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                                >
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Make Payment
                                </button>
                            ) : (
                                <div className="flex items-center text-green-600">
                                    <CheckCircle className="h-5 w-5 mr-2" />
                                    <span className="font-medium">Paid & Confirmed</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserBookings;
