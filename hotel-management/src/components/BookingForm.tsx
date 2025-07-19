import React, { useState } from 'react';
import { useAppDispatch } from '../hooks/redux';
import { addBooking, type NewBookingType } from '../features/bookingsSlice';
import { CreditCard, Star, X } from 'lucide-react';
import { type HotelType } from '../features/hotelsAuth';

interface BookingFormProps {
    hotel: HotelType;
    onClose: () => void;
    onSuccess: (details: {
        guestName: string;
        email: string;
        checkInDate: string;
        checkOutDate: string;
        guests: number;
        roomType: string;
        totalAmount: number;
    }) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ hotel, onClose, onSuccess }) => {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        roomId: 1,
        checkInDate: "",
        checkOutDate: "",
        totalAmount: 0,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "roomId" || name === "totalAmount" ? Number(value) : value,
        }));
    };

    const calculateNights = () => {
        if (formData.checkInDate && formData.checkOutDate) {
            const checkIn = new Date(formData.checkInDate);
            const checkOut = new Date(formData.checkOutDate);
            const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        }
        return 0;
    };

    const calculateTotal = () => {
        const nights = calculateNights();
        const basePrice = 100; // Base price per night
        const categoryMultiplier =
            {
                Luxury: 2.5,
                Business: 1.8,
                Resort: 2.0,
                Boutique: 1.5,
                Budget: 1.0,
            }[hotel.category] || 1.0;

        const total = nights * basePrice * categoryMultiplier;

        // Update formData with calculated total
        if (total !== formData.totalAmount) {
            setFormData((prev) => ({ ...prev, totalAmount: total }));
        }

        return total;
    };

    // Calculate total whenever dates change
    React.useEffect(() => {
        if (formData.checkInDate && formData.checkOutDate) {
            calculateTotal();
        }
    }, [formData.checkInDate, formData.checkOutDate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Get user from localStorage
            const currentUser = JSON.parse(localStorage.getItem("myUser") || "{}");

            // Create booking data
            const bookingData: NewBookingType = {
                userId: currentUser.userId,
                roomId: String(formData.roomId),
                checkInDate: formData.checkInDate,
                checkOutDate: formData.checkOutDate,
                totalAmount: formData.totalAmount,
                isConfirmed: true,
            };

            await dispatch(addBooking(bookingData)).unwrap();

            // Pass booking details to success callback
            onSuccess({
                guestName: currentUser.firstname + " " + currentUser.lastname || "Guest",
                email: currentUser.email || "guest@example.com",
                checkInDate: formData.checkInDate,
                checkOutDate: formData.checkOutDate,
                guests: 1,
                roomType: "Standard Room",
                totalAmount: formData.totalAmount,
            });
        } catch (error) {
            console.error("Booking failed:", error);
            alert("Booking failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating: string) => {
        const numRating = parseFloat(rating) || 0;
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star
                    key={i}
                    className={`h-4 w-4 ${i <= numRating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                />
            );
        }
        return stars;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors duration-200"
                >
                    <X className="h-5 w-5 text-gray-600" />
                </button>

                <div className="grid md:grid-cols-2 gap-0">
                    {/* Hotel Info Side */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-8 text-white">
                        <h2 className="text-2xl font-bold mb-4">Book Your Stay</h2>

                        <div className="bg-white/10 rounded-lg p-4 mb-6">
                            <img
                                src={
                                    hotel.imageUrl ||
                                    "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=400"
                                }
                                alt={hotel.name}
                                className="w-full h-32 object-cover rounded-lg mb-4"
                            />
                            <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
                            <p className="text-blue-100 mb-2">{hotel.location}</p>
                            <div className="flex items-center mb-2">
                                {renderStars(hotel.rating)}
                                <span className="ml-2">({hotel.rating})</span>
                            </div>
                            <span className="bg-white/20 px-2 py-1 rounded text-sm">{hotel.category}</span>
                        </div>

                        {/* Booking Summary */}
                        {formData.checkInDate && formData.checkOutDate && (
                            <div className="bg-white/10 rounded-lg p-4">
                                <h4 className="font-semibold mb-3">Booking Summary</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Nights:</span>
                                        <span>{calculateNights()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Room ID:</span>
                                        <span>#{formData.roomId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Category:</span>
                                        <span>{hotel.category}</span>
                                    </div>
                                    <div className="border-t border-white/20 pt-2 mt-2">
                                        <div className="flex justify-between font-semibold text-lg">
                                            <span>Total:</span>
                                            <span>{formatCurrency(formData.totalAmount)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Booking Form Side */}
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Room ID</label>
                                        <input
                                            type="number"
                                            name="roomId"
                                            value={formData.roomId}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                            min="1"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Total Amount ($)
                                        </label>
                                        <input
                                            type="number"
                                            name="totalAmount"
                                            value={formData.totalAmount}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                            min="1"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Stay Details</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Check-in Date
                                        </label>
                                        <input
                                            type="date"
                                            name="checkInDate"
                                            value={formData.checkInDate}
                                            onChange={handleInputChange}
                                            min={new Date().toISOString().split("T")[0]}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Check-out Date
                                        </label>
                                        <input
                                            type="date"
                                            name="checkOutDate"
                                            value={formData.checkOutDate}
                                            onChange={handleInputChange}
                                            min={formData.checkInDate || new Date().toISOString().split("T")[0]}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center font-semibold disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    ) : (
                                        <CreditCard className="h-5 w-5 mr-2" />
                                    )}
                                    {loading ? "Processing..." : "Complete Booking"}
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingForm;