import React from "react";
import { Save, X } from "lucide-react";
import type { NewHotelType } from "../../features/hotelsAuth";

interface HotelFormProps {
    formData: NewHotelType;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    title: string;
}

const HotelForm: React.FC<HotelFormProps> = ({ formData, onInputChange, onSubmit, onCancel, title }) => {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Hotel Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Luxury">Luxury</option>
                        <option value="Business">Business</option>
                        <option value="Budget">Budget</option>
                        <option value="Resort">Resort</option>
                        <option value="Boutique">Boutique</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Rating</label>
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
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Contact Phone</label>
                    <input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Image URL</label>
                <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={onInputChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div className="flex pt-4 space-x-3 w-full items-center justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    className="cusor-pointer flex items-center px-4 py-2 text-white transition-colors duration-200 bg-gray-500 rounded-lg hover:bg-gray-600"
                >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                </button>
                <button
                    type="submit"
                    className="cusor-pointer flex items-center px-4 py-2 text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                    <Save className="w-4 h-4 mr-2" />
                    Save Hotel
                </button>
            </div>
        </form>
    );
};

export default HotelForm;
