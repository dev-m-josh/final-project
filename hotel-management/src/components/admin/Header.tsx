import React from "react";

interface HeaderProps {
    activeTab: string;
}

const Header: React.FC<HeaderProps> = ({ activeTab }) => {
    const getTabLabel = (tab: string) => {
        const labels: { [key: string]: string } = {
            hotels: "Hotels",
            bookings: "Bookings",
            customers: "Customers",
            settings: "Settings",
        };
        return labels[tab] || "Dashboard";
    };

    return (
        <header className="px-6 py-4 bg-white border-b shadow-sm">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">{getTabLabel(activeTab)}</h1>
                <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">Welcome back, Admin</div>
                </div>
            </div>
        </header>
    );
};

export default Header;
