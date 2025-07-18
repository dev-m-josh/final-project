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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                    <input
                        type="number"
                        name="userId"
                        value={formData.userId}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        min="1"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room ID</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount ($)</label>
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

                {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirmation Status</label>
                    <select
                        name="isConfirmed"
                        value={formData.isConfirmed.toString()}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select Status</option>
                        <option value="false">Pending</option>
                        <option value="true">Confirmed</option>
                    </select>
                </div> */}

                {/* <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <select
                        name="rating"
                        value={formData.rating}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select Rating</option>
                        <option value="1">1 Star</option>
                        <option value="2">2 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="5">5 Stars</option>
                    </select>
                </div> */}
            </div>

            <div className="flex space-x-3 pt-4">
                <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                    <Save className="h-4 w-4 mr-2" />
                    Save Booking
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default BookingForm;
