import React, { useState } from "react";
import { Edit, Trash2, Eye, Search, Plus } from "lucide-react";
import type { RoomType } from "../../features/roomsSlice";

interface RoomTableProps {
    rooms: RoomType[];
    loading: boolean;
    onEdit: (room: RoomType) => void;
    onDelete: (roomId: number) => void;
    onView: (room: RoomType) => void;
    onAdd: () => void;
}

const RoomTable: React.FC<RoomTableProps> = ({ rooms, loading, onEdit, onDelete, onView, onAdd }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [filterAvailability, setFilterAvailability] = useState("all");

    const filteredRooms = rooms.filter((room) => {
        const matchesSearch =
            room.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.amenities.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === "all" || room.roomType === filterType;
        const matchesAvailability =
            filterAvailability === "all" ||
            (filterAvailability === "available" && room.isAvailable) ||
            (filterAvailability === "unavailable" && !room.isAvailable);

        return matchesSearch && matchesType && matchesAvailability;
    });

    const formatPrice = (price: string) => {
        return `$${parseFloat(price).toFixed(2)}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded mb-4"></div>
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-xl font-semibold text-gray-900">Rooms Management</h2>
                    <button
                        onClick={onAdd}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Room
                    </button>
                </div>

                {/* Filters */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search rooms..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Types</option>
                        <option value="Standard">Standard</option>
                        <option value="Deluxe">Deluxe</option>
                        <option value="Suite">Suite</option>
                        <option value="Presidential">Presidential</option>
                    </select>

                    <select
                        value={filterAvailability}
                        onChange={(e) => setFilterAvailability(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                    </select>

                    <div className="text-sm text-gray-500 flex items-center">
                        Showing {filteredRooms.length} of {rooms.length} rooms
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Room Details
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price/Night
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Capacity
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredRooms.map((room) => (
                            <tr key={room.roomId} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {room.roomType} - Room #{room.roomId}
                                        </div>
                                        <div className="text-sm text-gray-500">Hotel ID: {room.hotelId}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {formatPrice(room.pricePerNight)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{room.capacity} guests</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            room.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {room.isAvailable ? "Available" : "Unavailable"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(room.createdAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => onView(room)}
                                            className="text-gray-600 hover:text-gray-900 p-1 rounded transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onEdit(room)}
                                            className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                                            title="Edit Room"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(room.roomId)}
                                            className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                                            title="Delete Room"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredRooms.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500">
                            {searchTerm || filterType !== "all" || filterAvailability !== "all"
                                ? "No rooms match your search criteria."
                                : "No rooms found. Add your first room to get started."}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomTable;
