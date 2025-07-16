import React from "react";
import { X, Mail, Phone, MapPin, Calendar, Shield, CheckCircle, XCircle } from "lucide-react";
import type { UserType } from "../../features/usersSlice";

interface CustomerDetailsProps {
    customer: UserType;
    onClose: () => void;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({ customer, onClose }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute z-10 p-2 transition-colors duration-200 bg-white rounded-full shadow-lg top-4 right-4 hover:bg-gray-100"
                >
                    <X className="w-5 h-5 text-gray-600" />
                </button>

                {/* Header */}
                <div className="p-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl">
                    <div className="flex items-center">
                        <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full">
                            <span className="text-2xl font-bold text-blue-600">
                                {customer.firstname.charAt(0)}
                                {customer.lastname.charAt(0)}
                            </span>
                        </div>
                        <div className="ml-6 text-white">
                            <h2 className="text-2xl font-bold">
                                {customer.firstname} {customer.lastname}
                            </h2>
                            <p className="text-blue-100">Customer ID: #{customer.userId}</p>
                        </div>
                    </div>
                </div>

                {/* Customer Details */}
                <div className="p-8">
                    <div className="grid gap-6 mb-8 md:grid-cols-2">
                        <div>
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Contact Information</h3>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <Mail className="w-5 h-5 mr-3 text-blue-600" />
                                    <div>
                                        <p className="font-medium text-gray-900">Email</p>
                                        <p className="text-gray-600">{customer.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="w-5 h-5 mr-3 text-blue-600" />
                                    <div>
                                        <p className="font-medium text-gray-900">Phone</p>
                                        <p className="text-gray-600">{customer.contactPhone}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <MapPin className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">Address</p>
                                        <p className="text-gray-600">{customer.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Account Status</h3>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <Shield className="w-5 h-5 mr-3 text-blue-600" />
                                    <div>
                                        <p className="font-medium text-gray-900">Role</p>
                                        <span
                                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                customer.isAdmin === "true"
                                                    ? "bg-purple-100 text-purple-800"
                                                    : "bg-gray-100 text-gray-800"
                                            }`}
                                        >
                                            {customer.isAdmin === "true" ? "Admin" : "Customer"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    {customer.isVerified === "true" ? (
                                        <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
                                    ) : (
                                        <XCircle className="w-5 h-5 mr-3 text-red-600" />
                                    )}
                                    <div>
                                        <p className="font-medium text-gray-900">Verification Status</p>
                                        <span
                                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                customer.isVerified === "true"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {customer.isVerified === "true" ? "Verified" : "Unverified"}
                                        </span>
                                    </div>
                                </div>
                                {customer.verificationCode && (
                                    <div className="flex items-center">
                                        <div className="w-5 h-5 mr-3" />
                                        <div>
                                            <p className="font-medium text-gray-900">Verification Code</p>
                                            <p className="font-mono text-sm text-gray-600">
                                                {customer.verificationCode}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Account Timeline</h3>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                                <div>
                                    <p className="font-medium text-gray-900">Account Created</p>
                                    <p className="text-gray-600">{formatDate(customer.createdAt)}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                                <div>
                                    <p className="font-medium text-gray-900">Last Updated</p>
                                    <p className="text-gray-600">{formatDate(customer.updatedAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex pt-6 mt-8 space-x-4 border-t">
                        <button className="flex items-center justify-center flex-1 px-6 py-3 font-semibold text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700">
                            <Mail className="w-5 h-5 mr-2" />
                            Send Email
                        </button>
                        <button className="px-6 py-3 font-semibold text-blue-600 transition-colors duration-200 border border-blue-600 rounded-lg hover:bg-blue-50">
                            Edit Customer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetails;
