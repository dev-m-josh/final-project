import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
    fetchHotels,
    addHotel,
    updateHotel,
    deleteHotel,
    type HotelType,
    type NewHotelType,
    type UpdateHotelType
} from "../../features/hotelsAuth";

// Import components
import Sidebar from "../admin/Sidebar";
import Header from "../admin/Header";
import StatsCards from "../admin/StatsCards";
import HotelsTable from "../admin/HotelsTable";
import HotelForm from "../admin/HotelForm";
import Modal from "../admin/Modal";

const AdminDashboard = () => {
    const dispatch = useAppDispatch();
    const { hotels, loading, error } = useAppSelector((state) => state.hotels);

    const [activeTab, setActiveTab] = useState("hotels");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingHotel, setEditingHotel] = useState<UpdateHotelType | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState<NewHotelType>({
        name: "",
        imageUrl: "",
        location: "",
        address: "",
        contactPhone: "",
        category: "",
        rating: "",
    });

    useEffect(() => {
        dispatch(fetchHotels());
    }, [dispatch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddHotel = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(addHotel(formData)).unwrap();
            setShowAddModal(false);
            resetForm();
        } catch (error) {
            console.error("Failed to add hotel:", error);
        }
    };

    const handleEditHotel = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingHotel) return;

        try {
            const updatedHotel: UpdateHotelType = {
                ...editingHotel,
                ...formData,
            };
            await dispatch(updateHotel(updatedHotel)).unwrap();
            setShowEditModal(false);
            setEditingHotel(null);
            resetForm();
        } catch (error) {
            console.error("Failed to update hotel:", error);
        }
    };

    const handleDeleteHotel = async (hotelId: number) => {
        if (window.confirm("Are you sure you want to delete this hotel?")) {
            try {
                await dispatch(deleteHotel(hotelId)).unwrap();
            } catch (error) {
                console.error("Failed to delete hotel:", error);
            }
        }
    };

    const openEditModal = (hotel: HotelType) => {
        setEditingHotel(hotel);
        setFormData({
            name: hotel.name,
            imageUrl: hotel.imageUrl,
            location: hotel.location,
            address: hotel.address,
            contactPhone: hotel.contactPhone,
            category: hotel.category,
            rating: hotel.rating,
        });
        setShowEditModal(true);
    };

    const resetForm = () => {
        setFormData({
            name: "",
            imageUrl: "",
            location: "",
            address: "",
            contactPhone: "",
            category: "",
            rating: "",
        });
    };

    const handleCancel = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setEditingHotel(null);
        resetForm();
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content */}
            <div className="flex-1 ml-64">
                {/* Header */}
                <Header activeTab={activeTab} />

                {/* Content */}
                <main className="p-6">
                    {activeTab === "hotels" && (
                        <>
                            {/* Stats Cards */}
                            <StatsCards hotelCount={hotels.length} />

                            {/* Hotels Management */}
                            <HotelsTable
                                hotels={hotels}
                                loading={loading}
                                error={error}
                                searchTerm={searchTerm}
                                onSearchChange={setSearchTerm}
                                onAddClick={() => setShowAddModal(true)}
                                onEditClick={openEditModal}
                                onDeleteClick={handleDeleteHotel}
                                onRetry={() => dispatch(fetchHotels())}
                            />
                        </>
                    )}

                    {activeTab === "bookings" && (
                        <div className="p-6 bg-white rounded-lg shadow">
                            <h2 className="mb-4 text-xl font-semibold text-gray-900">Bookings Management</h2>
                            <p className="text-gray-600">Bookings management functionality coming soon...</p>
                        </div>
                    )}

                    {activeTab === "customers" && (
                        <div className="p-6 bg-white rounded-lg shadow">
                            <h2 className="mb-4 text-xl font-semibold text-gray-900">Customer Management</h2>
                            <p className="text-gray-600">Customer management functionality coming soon...</p>
                        </div>
                    )}

                    {activeTab === "settings" && (
                        <div className="p-6 bg-white rounded-lg shadow">
                            <h2 className="mb-4 text-xl font-semibold text-gray-900">Settings</h2>
                            <p className="text-gray-600">Settings functionality coming soon...</p>
                        </div>
                    )}
                </main>
            </div>

            {/* Add Hotel Modal */}
            <Modal isOpen={showAddModal} onClose={handleCancel}>
                <HotelForm
                    formData={formData}
                    onInputChange={handleInputChange}
                    onSubmit={handleAddHotel}
                    onCancel={handleCancel}
                    title="Add New Hotel"
                />
            </Modal>

            {/* Edit Hotel Modal */}
            <Modal isOpen={showEditModal} onClose={handleCancel}>
                <HotelForm
                    formData={formData}
                    onInputChange={handleInputChange}
                    onSubmit={handleEditHotel}
                    onCancel={handleCancel}
                    title="Edit Hotel"
                />
            </Modal>
        </div>
    );
};

export default AdminDashboard;
