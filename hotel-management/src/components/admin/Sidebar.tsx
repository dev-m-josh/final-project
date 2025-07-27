import React from "react";
import { Hotel, BarChart3, Users, Bed, Ticket, CreditCard } from "lucide-react";

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
    const sidebarItems = [
        { id: "hotels", label: "Hotels", icon: Hotel },
        { id: "bookings", label: "Bookings", icon: BarChart3 },
        { id: "customers", label: "Customers", icon: Users },
        { id: "rooms", label: "Rooms", icon: Bed },
        { id: "tickets", label: "Tickets", icon: Ticket },
        { id: "payments", label: "Payments", icon: CreditCard },
    ];

    return (
        <div className="fixed w-64 h-full bg-white shadow-lg">
            <div className="p-6 border-b">
                <div className="flex items-center">
                    <Hotel className="w-8 h-8 text-blue-600" />
                    <span className="ml-2 text-xl font-bold text-gray-800">BookStay Admin</span>
                </div>
            </div>

            <nav className="mt-6">
                {sidebarItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center px-6 py-3 text-left hover:bg-blue-50 transition-colors duration-200 ${
                            activeTab === item.id
                                ? "bg-blue-50 border-r-2 border-blue-600 text-blue-600"
                                : "text-gray-700"
                        }`}
                    >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.label}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;