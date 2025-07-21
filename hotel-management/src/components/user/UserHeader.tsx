import React from "react";

interface UserHeaderProps {
    activeTab: string;
    userName: string;
}

const UserHeader: React.FC<UserHeaderProps> = ({ activeTab, userName }) => {
    const getTabLabel = (tab: string) => {
        const labels: { [key: string]: string } = {
            bookings: "My Bookings",
            payments: "My Payments",
            profile: "Profile",
        };
        return labels[tab] || "Dashboard";
    };

    return (
        <header className="bg-white shadow-sm border-b px-6 py-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">{getTabLabel(activeTab)}</h1>
                <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">Welcome back, {userName}</div>
                </div>
            </div>
        </header>
    );
};

export default UserHeader;
