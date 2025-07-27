import React from "react";
import { Calendar, CreditCard } from "lucide-react";

interface UserSidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ activeTab, setActiveTab }) => {
    const sidebarItems = [
        { id: "bookings", label: "My Bookings", icon: Calendar },
        { id: "payments", label: "My Payments", icon: CreditCard },
    ];

    return (
        <div className="w-64 bg-white shadow-lg fixed h-full mt-17">
            <div className="p-6 border-b">
                <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-blue-600" />
                    <span className="ml-2 text-xl font-bold text-gray-800">My Dashboard</span>
                </div>
            </div>

            <nav className="mt-6">
                {sidebarItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`cursor-pointer w-full flex items-center px-6 py-3 text-left hover:bg-blue-50 transition-colors duration-200 ${
                            activeTab === item.id
                                ? "bg-blue-50 border-r-2 border-blue-600 text-blue-600"
                                : "text-gray-700"
                        }`}
                    >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.label}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default UserSidebar;
