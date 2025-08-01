import React, { useEffect, useState } from 'react';
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
    const [rooms, setRooms] = useState([]);
    const [formData, setFormData] = useState({
        roomId: 0,
        checkInDate: "",
        checkOutDate: "",
        totalAmount: 0,
        pricePerNight: 0,
        guests: 1,
    });

    useEffect(() => {
    const fetchRooms = async () => {
        try {
            const response = await fetch(`https://final-project-api-q0ob.onrender.com/rooms/available/${hotel.hotelId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch available rooms");
            } else {
                const data = await response.json();
                setRooms(data);
            }
        } catch (error) {
            console.error("Error fetching available rooms:", error);
            setRooms([]);
        }
    };

    fetchRooms();
    }, [hotel.hotelId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "roomId" || name === "totalAmount" ? Number(value) : value,
        }));
    };

    const handleRoomSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRoomId = Number(e.target.value);
        const selectedRoom = rooms.find((room: any) => room.roomId === selectedRoomId);

        const nights = calculateNights();
        const pricePerNight = selectedRoom?.pricePerNight || 0;
        const total = nights * pricePerNight;

        setFormData((prev) => ({
            ...prev,
            roomId: selectedRoomId,
            pricePerNight: pricePerNight,
            totalAmount: total,
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

        // Find the selected room object
        const selectedRoom = rooms.find((room: any) => room.roomId === formData.roomId);

        if (!selectedRoom) return 0;

        const basePrice = selectedRoom.pricePerNight || 0;

        const total = nights * basePrice;

        // Update formData if changed
        if (total !== formData.totalAmount) {
            setFormData((prev) => ({ ...prev, totalAmount: total }));
        }

        return total;
    };

    // Calculate total whenever dates change
    React.useEffect(() => {
        if (formData.checkInDate || formData.checkOutDate || formData.roomId) {
            calculateTotal();
        }
    }, [formData.checkInDate, formData.checkOutDate, formData.roomId]);

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
                isConfirmed: false,
            };

            await dispatch(addBooking(bookingData)).unwrap();

            // Pass booking details to success callback
            onSuccess({
                guestName: currentUser.firstname + " " + currentUser.lastname || "Guest",
                email: currentUser.email || "guest@example.com",
                checkInDate: formData.checkInDate,
                checkOutDate: formData.checkOutDate,
                guests: formData.guests,
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
                    data-testid="close-modal"
                    onClick={onClose}
                    className="cursor-pointer absolute z-10 p-2 transition-colors duration-200 bg-white rounded-full shadow-lg top-4 right-4 hover:bg-gray-100"
                >
                    <X className="w-5 h-5 text-gray-600" />
                </button>

                <div className="grid gap-0 md:grid-cols-2">
                    {/* Hotel Info Side */}
                    <div className="p-8 text-white bg-gradient-to-br from-blue-600 to-indigo-600">
                        <h2 data-testid={`hotel-title-${hotel.hotelId}`} className="mb-4 text-2xl font-bold">
                            Book Your Stay
                        </h2>

                        <div className="p-4 mb-6 rounded-lg bg-white/10">
                            <img
                                src={
                                    hotel.imageUrl ||
                                    "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=400"
                                }
                                alt={hotel.name}
                                className="object-cover w-full h-32 mb-4 rounded-lg"
                                data-testid={`hotel-image-${hotel.hotelId}`}
                            />
                            <h3 data-testid={`hotel-name-${hotel.hotelId}`} className="mb-2 text-xl font-semibold">
                                {hotel.name}
                            </h3>
                            <p data-testid={`hotel-location-${hotel.hotelId}`} className="mb-2 text-blue-100">
                                {hotel.location}
                            </p>
                            <div className="flex items-center mb-2">
                                {renderStars(hotel.rating)}
                                <span className="ml-2">({hotel.rating})</span>
                            </div>
                            <span
                                className="px-2 py-1 text-sm rounded bg-white/20"
                                data-testid={`hotel-category-${hotel.hotelId}`}
                            >
                                {hotel.category}
                            </span>
                        </div>

                        {/* Booking Summary */}
                        {formData.checkInDate && formData.checkOutDate && (
                            <div className="p-4 rounded-lg bg-white/10">
                                <h4 className="mb-3 font-semibold">Booking Summary</h4>
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
                                    <div className="pt-2 mt-2 border-t border-white/20">
                                        <div className="flex justify-between text-lg font-semibold">
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
                                <h3 className="mb-4 text-xl font-semibold text-gray-900">Booking Details</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-700">
                                            Select Room
                                        </label>
                                        <select
                                            name="roomId"
                                            value={formData.roomId}
                                            onChange={handleRoomSelect}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                            data-testid="room-select"
                                        >
                                            <option value="">Select a room</option>
                                            {rooms.map((room: any) => (
                                                <option key={room.roomId} value={room.roomId}>
                                                    {room.roomId}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-700">
                                            Total Amount ($)
                                        </label>
                                        <input
                                            type="number"
                                            name="pricePerNight"
                                            value={formData.pricePerNight}
                                            readOnly
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            min="1"
                                            data-testid="total-amount-input"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Number of Guests</label>
                                <input
                                    type="number"
                                    name="guests"
                                    value={formData.guests}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="1"
                                    data-testid="total-guests-input"
                                />
                            </div>

                            <div>
                                <h3 className="mb-4 text-xl font-semibold text-gray-900">Stay Details</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-700">
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
                                            data-testid="check-in-date-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-700">
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
                                            data-testid="check-out-date-input"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex pt-4 space-x-4">
                                <button
                                    data-testid="cancel-button"
                                    type="button"
                                    onClick={onClose}
                                    className="cursor-pointer px-6 py-3 font-semibold text-gray-700 transition-colors duration-200 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    data-testid="complete-booking-button"
                                    type="submit"
                                    disabled={loading}
                                    className="cursor-pointer flex items-center justify-center flex-1 px-6 py-3 font-semibold text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                                    ) : (
                                        <CreditCard className="w-5 h-5 mr-2" />
                                    )}
                                    {loading ? "Processing..." : "Complete Booking"}
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