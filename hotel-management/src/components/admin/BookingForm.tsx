import React from "react";
import { Save, X } from "lucide-react";
import type { NewBookingType } from "../../features/bookingsSlice";

interface BookingFormProps {
    formData: NewBookingType;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    title: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ formData, onInputChange, onSubmit, onCancel, title }) => {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">User ID</label>
                    <input
                        type="number"
                        name="userId"
                        value={formData.userId}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        min="1"
                        disabled
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Room ID</label>
                    <input
                        type="number"
                        name="roomId"
                        value={formData.roomId}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        min="1"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Check-in Date</label>
                    <input
                        type="date"
                        name="checkInDate"
                        value={formData.checkInDate}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Check-out Date</label>
                    <input
                        type="date"
                        name="checkOutDate"
                        value={formData.checkOutDate}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Total Amount ($)</label>
                    <input
                        type="number"
                        name="totalAmount"
                        value={formData.totalAmount}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        min="0"
                        step="0.01"
                    />
                </div>
            </div>

            <div className="flex pt-4 space-x-3 justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    className="cursor-pointer flex items-center px-4 py-2 text-white transition-colors duration-200 bg-gray-500 rounded-lg hover:bg-gray-600"
                >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                </button>
                <button
                    type="submit"
                    className="cursor-pointer flex items-center px-4 py-2 text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                    <Save className="w-4 h-4 mr-2" />
                    Save Booking
                </button>
            </div>
        </form>
    );
};

export default BookingForm;
