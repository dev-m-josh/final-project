import React from "react";
import { BarChart3 } from "lucide-react";

interface StatsCardsProps {
    hotelCount: number;
    customerCount?: number;
    bookingsCount?: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({ hotelCount, customerCount = 0, bookingsCount = 0 }) => {
    const stats = [
        { label: "Total Hotels", value: hotelCount, color: "bg-blue-500" },
        { label: "Active Bookings", value: bookingsCount, color: "bg-green-500" },
        { label: "Total Customers", value: customerCount, color: "bg-purple-500" },
        { label: "Revenue", value: "$123,456", color: "bg-orange-500" },
    ];

    return (
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <div key={index} className="p-6 bg-white rounded-lg shadow">
                    <div className="flex items-center">
                        <div className={`${stat.color} rounded-lg p-3 mr-4`}>
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;
