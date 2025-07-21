import React from "react";
import { User, Mail, Phone, MapPin, Calendar, Shield } from "lucide-react";

interface UserProfileProps {
    user: {
        userId: number;
        name: string;
        email: string;
        phone: string;
        address: string;
        joinDate: string;
    };
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
                <div className="flex items-center mb-6">
                    <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-10 w-10 text-blue-600" />
                    </div>
                    <div className="ml-6">
                        <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                        <p className="text-gray-600">Customer ID: #{user.userId}</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <Mail className="h-5 w-5 text-blue-600 mr-3" />
                                <div>
                                    <p className="font-medium text-gray-900">Email</p>
                                    <p className="text-gray-600">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Phone className="h-5 w-5 text-blue-600 mr-3" />
                                <div>
                                    <p className="font-medium text-gray-900">Phone</p>
                                    <p className="text-gray-600">{user.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <MapPin className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                                <div>
                                    <p className="font-medium text-gray-900">Address</p>
                                    <p className="text-gray-600">{user.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                                <div>
                                    <p className="font-medium text-gray-900">Member Since</p>
                                    <p className="text-gray-600">{formatDate(user.joinDate)}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Shield className="h-5 w-5 text-blue-600 mr-3" />
                                <div>
                                    <p className="font-medium text-gray-900">Account Status</p>
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                        Verified
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex space-x-4">
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                            Edit Profile
                        </button>
                        <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                            Change Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
