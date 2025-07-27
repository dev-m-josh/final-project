import React from "react";
import { Save, X } from "lucide-react";
import type { NewUserType, UpdateUserType } from "../../features/usersSlice";

interface CustomerFormProps {
    formData: UpdateUserType | NewUserType;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    title: string;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ formData, onInputChange, onSubmit, onCancel, title }) => {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">First Name</label>
                    <input
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Last Name</label>
                    <input
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled
                    />
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
                    <label className="block mb-1 text-sm font-medium text-gray-700">Admin Status</label>
                    <select
                        name="isAdmin"
                        value={formData.isAdmin}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select Role</option>
                        <option value="false">Customer</option>
                        <option value="true">Admin</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Verification Status</label>
                    <select
                        name="isVerified"
                        value={formData.isVerified}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select Status</option>
                        <option value="false">Unverified</option>
                        <option value="true">Verified</option>
                    </select>
                </div>
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
                    Save Customer
                </button>
            </div>
        </form>
    );
};

export default CustomerForm;
