import React from "react";
import { Plus, Search, Edit, Trash2, Mail, Phone, Shield, CheckCircle, XCircle } from "lucide-react";
import type { UserType } from "../../features/usersSlice";

interface CustomersTableProps {
    users: UserType[];
    loading: boolean;
    error: string | null;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onAddClick: () => void;
    onEditClick: (user: UserType) => void;
    onDeleteClick: (userId: number) => void;
    onViewClick: (user: UserType) => void;
    onRetry: () => void;
}

const CustomersTable: React.FC<CustomersTableProps> = ({
    users,
    loading,
    error,
    searchTerm,
    onSearchChange,
    onAddClick,
    onEditClick,
    onDeleteClick,
    onViewClick,
    onRetry,
}) => {
    const filteredUsers = users.filter(
        (user) =>
            user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString: Date) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Customer Management</h2>
                    <button
                        onClick={onAddClick}
                        className="flex items-center px-4 py-2 text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Customer
                    </button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                    <input
                        type="text"
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Customers Table */}
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="inline-block w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                        <p className="mt-2 text-gray-600">Loading customers...</p>
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
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                    Joined
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.userId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                                                <span className="font-medium text-blue-600">
                                                    {user.firstname.charAt(0)}
                                                    {user.lastname.charAt(0)}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.firstname} {user.lastname}
                                                </div>
                                                <div className="text-sm text-gray-500">ID: {user.userId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <div className="flex items-center text-sm text-gray-900">
                                                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                                {user.email}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                                {user.contactPhone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {user.isVerified ? (
                                                <>
                                                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                                    <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                                                        Verified
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="w-4 h-4 mr-2 text-red-500" />
                                                    <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
                                                        Unverified
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Shield className="w-4 h-4 mr-2 text-gray-400" />
                                            <span
                                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                    user.isAdmin
                                                        ? "bg-purple-100 text-purple-800"
                                                        : "bg-gray-100 text-gray-800"
                                                }`}
                                            >
                                                {user.isAdmin ? "Admin" : "Customer"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                        {formatDate(user.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => onViewClick(user)}
                                                className="p-1 text-blue-600 rounded hover:text-blue-900 hover:bg-blue-50"
                                                title="View Details"
                                            >
                                                <Mail className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onEditClick(user)}
                                                className="p-1 text-green-600 rounded hover:text-green-900 hover:bg-green-50"
                                                title="Edit Customer"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onDeleteClick(user.userId)}
                                                className="p-1 text-red-600 rounded hover:text-red-900 hover:bg-red-50"
                                                title="Delete Customer"
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

export default CustomersTable;
