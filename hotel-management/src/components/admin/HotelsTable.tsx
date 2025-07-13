import React from "react";
import { Plus, Search, Edit, Trash2, MapPin, Phone, Star } from "lucide-react";
import type { HotelType } from "../../features/hotelsAuth";

interface HotelsTableProps {
    hotels: HotelType[];
    loading: boolean;
    error: string | null;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onAddClick: () => void;
    onEditClick: (hotel: HotelType) => void;
    onDeleteClick: (hotelId: number) => void;
    onRetry: () => void;
}

const HotelsTable: React.FC<HotelsTableProps> = ({
    hotels,
    loading,
    error,
    searchTerm,
    onSearchChange,
    onAddClick,
    onEditClick,
    onDeleteClick,
    onRetry,
}) => {
    const filteredHotels = hotels.filter(
        (hotel) =>
            hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Hotel Management</h2>
                    <button
                        onClick={onAddClick}
                        className="flex items-center px-4 py-2 text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Hotel
                    </button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                    <input
                        type="text"
                        placeholder="Search hotels..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Hotels Table */}
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="inline-block w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                        <p className="mt-2 text-gray-600">Loading hotels...</p>
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-red-600">
                        <p>Error: {error}</p>
                        <button
                            onClick={onRetry}
                            className="px-6 py-2 mt-4 text-white transition-colors duration-200 bg-red-600 rounded-lg hover:bg-red-700"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                    Hotel
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                    Location
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                    Rating
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredHotels.map((hotel) => (
                                <tr key={hotel.hotelId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img
                                                src={
                                                    hotel.imageUrl ||
                                                    "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=100"
                                                }
                                                alt={hotel.name}
                                                className="object-cover w-12 h-12 mr-4 rounded-lg"
                                            />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{hotel.name}</div>
                                                <div className="text-sm text-gray-500">ID: {hotel.hotelId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-900">
                                            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                            {hotel.location}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                                            {hotel.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {renderStars(hotel.rating)}
                                            <span className="ml-1 text-sm text-gray-600">({hotel.rating})</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-900">
                                            <Phone className="w-4 h-4 mr-1 text-gray-400" />
                                            {hotel.contactPhone}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => onEditClick(hotel)}
                                                className="p-1 text-blue-600 rounded hover:text-blue-900 hover:bg-blue-50"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onDeleteClick(hotel.hotelId)}
                                                className="p-1 text-red-600 rounded hover:text-red-900 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
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

export default HotelsTable;
