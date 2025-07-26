import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchRooms, addRoom, updateRoom, deleteRoom } from "../../features/roomsSlice";
import type { RoomType, NewRoomType, UpdateRoomType } from "../../features/roomsSlice";
import RoomTable from "./RoomsTable";
import RoomForm from "./RoomsForm";
import { X } from "lucide-react";

const Rooms: React.FC = () => {
    const dispatch = useAppDispatch();
    const { rooms, loading, error } = useAppSelector((state) => state.rooms);
    const [showForm, setShowForm] = useState(false);
    const [editingRoom, setEditingRoom] = useState<RoomType | null>(null);
    const [viewingRoom, setViewingRoom] = useState<RoomType | null>(null);

    useEffect(() => {
        dispatch(fetchRooms());
    }, [dispatch]);

    const handleAddRoom = () => {
        setEditingRoom(null);
        setShowForm(true);
    };

    const handleEditRoom = (room: RoomType) => {
        setEditingRoom(room);
        setShowForm(true);
    };

    const handleViewRoom = (room: RoomType) => {
        setViewingRoom(room);
    };

    const handleDeleteRoom = async (roomId: number) => {
        if (window.confirm("Are you sure you want to delete this room?")) {
            await dispatch(deleteRoom(roomId));
        }
    };

    const handleFormSubmit = async (roomData: NewRoomType | UpdateRoomType) => {
        if (editingRoom) {
            await dispatch(updateRoom(roomData as UpdateRoomType));
        } else {
            await dispatch(addRoom(roomData as NewRoomType));
        }
        setShowForm(false);
        setEditingRoom(null);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingRoom(null);
    };

    const handleCloseView = () => {
        setViewingRoom(null);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Rooms Management</h1>
                    <p className="mt-1 text-gray-600">Manage hotel rooms and their availability</p>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="text-red-800">{error}</div>
                </div>
            )}

            {/* Rooms Table */}
            <RoomTable
                rooms={rooms}
                loading={loading}
                onAdd={handleAddRoom}
                onEdit={handleEditRoom}
                onView={handleViewRoom}
                onDelete={handleDeleteRoom}
            />

            {/* Room Form Modal */}
            <RoomForm
                isOpen={showForm}
                onClose={handleCloseForm}
                onSubmit={handleFormSubmit}
                room={editingRoom}
                loading={loading}
            />

            {/* Room View Modal */}
            {viewingRoom && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-600 bg-opacity-75">
                    <div className="w-full max-w-2xl overflow-y-auto bg-white rounded-lg shadow-xl max-h-90vh">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">
                                Room Details - {viewingRoom.roomType} #{viewingRoom.roomId}
                            </h3>
                            <button
                                onClick={handleCloseView}
                                className="text-gray-400 transition-colors duration-150 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <h4 className="mb-2 text-sm font-medium tracking-wider text-gray-500 uppercase">
                                        Basic Information
                                    </h4>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-sm font-medium text-gray-900">Room ID:</span>
                                            <span className="ml-2 text-sm text-gray-600">#{viewingRoom.roomId}</span>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-900">Hotel ID:</span>
                                            <span className="ml-2 text-sm text-gray-600">#{viewingRoom.hotelId}</span>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-900">Room Type:</span>
                                            <span className="ml-2 text-sm text-gray-600">{viewingRoom.roomType}</span>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-900">Capacity:</span>
                                            <span className="ml-2 text-sm text-gray-600">
                                                {viewingRoom.capacity} guests
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="mb-2 text-sm font-medium tracking-wider text-gray-500 uppercase">
                                        Pricing & Status
                                    </h4>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-sm font-medium text-gray-900">Price per Night:</span>
                                            <span className="ml-2 text-sm text-gray-600">
                                                ${viewingRoom.pricePerNight}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-900">Status:</span>
                                            <span
                                                className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    viewingRoom.isAvailable
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {viewingRoom.isAvailable ? "Available" : "Unavailable"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-900">Created:</span>
                                            <span className="ml-2 text-sm text-gray-600">
                                                {new Date(viewingRoom.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="mb-2 text-sm font-medium tracking-wider text-gray-500 uppercase">
                                    Amenities
                                </h4>
                                <div className="p-4 rounded-lg bg-gray-50">
                                    <p className="text-sm text-gray-700">{viewingRoom.amenities}</p>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 space-x-3 border-t border-gray-200">
                                <button
                                    onClick={() => {
                                        handleCloseView();
                                        handleEditRoom(viewingRoom);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-white transition-colors duration-150 bg-blue-600 rounded-md hover:bg-blue-700"
                                >
                                    Edit Room
                                </button>
                                <button
                                    onClick={handleCloseView}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-150 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Rooms;
