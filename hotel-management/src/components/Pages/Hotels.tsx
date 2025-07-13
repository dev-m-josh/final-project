import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchHotels, hotelDetails, type HotelType } from "../../features/hotelsAuth";
import { MapPin, Star, Phone, Loader2, Calendar, X, Mail } from "lucide-react";
import { Search } from "lucide-react";

const Hotels = () => {
    const dispatch = useAppDispatch();
    const { hotels, loading, error, selectedHotel } = useAppSelector((state) => state.hotels);
    const [showPopup, setShowPopup] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(fetchHotels());
    }, [dispatch]);

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

    const HotelCard = ({ hotel }: { hotel: HotelType }) => (
        <div className="overflow-hidden transition-shadow duration-300 bg-white shadow-lg rounded-xl hover:shadow-xl group">
            <div className="relative h-64 overflow-hidden">
                <img
                    src={
                        hotel.imageUrl ||
                        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fhotel-exterior&psig=AOvVaw2HXqlxdwFLIHx3sq7DzapX&ust=1752484753202000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMjv7dHAuY4DFQAAAAAdAAAAABAE"
                    }
                    alt={hotel.name}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute px-3 py-1 bg-white rounded-full shadow-md top-4 right-4">
                    <span className="text-sm font-semibold text-gray-800">{hotel.category}</span>
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-blue-600">
                        {hotel.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                        {renderStars(hotel.rating)}
                        <span className="ml-1 text-sm text-gray-600">({hotel.rating})</span>
                    </div>
                </div>

                <div className="flex items-center mb-2 text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{hotel.location}</span>
                </div>

                <p className="mb-4 text-sm text-gray-600 line-clamp-2">{hotel.address}</p>

                <div className="flex items-center mb-4 text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <span className="text-sm">{hotel.contactPhone}</span>
                </div>

                <div className="flex space-x-3">
                    <button className="flex items-center justify-center flex-1 px-4 py-2 text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Now
                    </button>
                    <button
                        onClick={() => handleViewDetails(hotel)}
                        className="px-4 py-2 text-blue-600 transition-colors duration-200 border border-blue-600 rounded-lg hover:bg-blue-50"
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );

    const handleViewDetails = (hotel: HotelType) => {
        dispatch(hotelDetails(hotel.hotelId));
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    // const filteredHotels = hotels.filter((hotel) =>
    //     `${hotel.name} ${hotel.location} ${hotel.category}`
    //      .toLowerCase().includes(searchTerm.toLowerCase())
    // );

    const filteredHotels = hotels.filter((hotel) =>
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase()
        ));

    return (
        <section id="hotels" className="relative min-h-screen py-20 bg-gray-50">
            <div className="w-full px-4 mx-auto sm:px-6 lg:px-8">
                {/* Header */}
                <div className={`text-center mb-8 transition-all duration-300 ${showPopup ? "blur-sm" : ""}`}>
                    <h1 className="mb-4 text-4xl font-bold text-gray-900">Find Your Perfect Hotel</h1>
                    <p className="max-w-3xl mx-auto text-xl text-gray-600">
                        Discover amazing hotels worldwide and book your perfect room with ease. Compare prices, read
                        reviews, and enjoy seamless booking experiences.
                    </p>
                </div>
                <div className="relative max-w-xl mx-auto mb-8">
                    <Search className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
                    <input
                        type="text"
                        placeholder="Search hotels..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Loading State */}
                {loading && !showPopup && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        <span className="ml-2 text-gray-600">Loading hotels...</span>
                    </div>
                )}

                {/* Error State */}
                {error && !showPopup && (
                    <div className="p-6 text-center border border-red-200 rounded-lg bg-red-50">
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={() => dispatch(fetchHotels())}
                            className="px-6 py-2 mt-4 text-white transition-colors duration-200 bg-red-600 rounded-lg hover:bg-red-700"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Hotels Grid */}
                {!loading && !error && (
                    <>
                        {filteredHotels.length > 0 ? (
                            <div
                                className={`w-full grid md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-300 ${
                                    showPopup ? "blur-sm" : ""
                                }`}
                            >
                                {filteredHotels.map((hotel) => (
                                    <HotelCard key={hotel.hotelId} hotel={hotel} />
                                ))}
                            </div>
                        ) : (
                            <div
                                className={`text-center py-20 transition-all duration-300 ${
                                    showPopup ? "blur-sm" : ""
                                }`}
                            >
                                <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                <h3 className="mb-2 text-xl font-semibold text-gray-900">No hotels found</h3>
                                <p className="text-gray-600">No hotels are currently available.</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Hotel Details Popup */}
            {showPopup && selectedHotel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closePopup}></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Close Button */}
                        <button
                            onClick={closePopup}
                            className="absolute z-10 p-2 transition-colors duration-200 bg-white rounded-full shadow-lg top-4 right-4 hover:bg-gray-100"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>

                        {/* Hotel Image */}
                        <div className="relative h-64 overflow-hidden rounded-t-2xl">
                            <img
                                src={
                                    selectedHotel.imageUrl ||
                                    "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800"
                                }
                                alt={selectedHotel.name}
                                className="object-cover w-full h-full"
                            />
                            <div className="absolute px-3 py-1 bg-white rounded-full shadow-md top-4 left-4">
                                <span className="text-sm font-semibold text-gray-800">{selectedHotel.category}</span>
                            </div>
                        </div>

                        {/* Hotel Details */}
                        <div className="p-8">
                            <div className="flex items-start justify-between mb-6">
                                <h2 className="text-3xl font-bold text-gray-900">{selectedHotel.name}</h2>
                                <div className="flex items-center space-x-1">
                                    {renderStars(selectedHotel.rating)}
                                    <span className="ml-2 text-lg font-semibold text-gray-700">
                                        ({selectedHotel.rating})
                                    </span>
                                </div>
                            </div>

                            <div className="grid gap-6 mb-8 md:grid-cols-2">
                                <div>
                                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Location & Contact</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-start">
                                            <MapPin className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-gray-900">{selectedHotel.location}</p>
                                                <p className="text-sm text-gray-600">{selectedHotel.address}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <Phone className="w-5 h-5 mr-3 text-blue-600" />
                                            <span className="text-gray-700">{selectedHotel.contactPhone}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Hotel Information</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Category:</span>
                                            <span className="font-medium text-gray-900">{selectedHotel.category}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Rating:</span>
                                            <span className="font-medium text-gray-900">{selectedHotel.rating}/5</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Hotel ID:</span>
                                            <span className="font-medium text-gray-900">#{selectedHotel.hotelId}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-4">
                                <button className="flex items-center justify-center flex-1 px-6 py-3 font-semibold text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700">
                                    <Calendar className="w-5 h-5 mr-2" />
                                    Book Now
                                </button>
                                <button className="px-6 py-3 font-semibold text-blue-600 transition-colors duration-200 border border-blue-600 rounded-lg hover:bg-blue-50">
                                    <Mail className="inline w-5 h-5 mr-2" />
                                    Contact Hotel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Hotels;
