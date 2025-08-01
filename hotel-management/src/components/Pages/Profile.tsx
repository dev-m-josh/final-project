import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

type User = {
    userId: string;
    firstname: string;
    lastname: string;
    email: string;
    contactPhone?: string;
    address?: string;
    isAdmin: boolean;
    isVerified: boolean;
};

const Profile = () => {
    const loggedInUser = JSON.parse(localStorage.getItem("myUser") || "{}");
    const token = localStorage.getItem("myToken");

    const [user, setUser] = useState<User | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        address: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(
                    `https://final-project-api-q0ob.onrender.com/users/details/${loggedInUser.userId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }

                const data: User = await response.json();
                setUser(data);

                setFormData({
                    firstName: data.firstname || "",
                    lastName: data.lastname || "",
                    email: data.email || "",
                    phoneNumber: data.contactPhone || "",
                    address: data.address || "",
                });
            } catch (error) {
                console.error("Error fetching user:", error);
                alert("An error occurred while fetching your profile. Please try again later.");
            }
        };

        if (loggedInUser.userId && token) {
            fetchUser();
        }
    }, [loggedInUser.userId, token]);

    useEffect(() => {
        if (!token || !loggedInUser.userId) {
            setShowLoginModal(true);
        }
    }, [token, loggedInUser.userId]);

    const fullName = `${user?.firstname || ""} ${user?.lastname || ""}`;
    const initials = `${user?.firstname?.[0] || ""}${user?.lastname?.[0] || ""}`.toUpperCase();
    const accountType = user?.isAdmin ? "Admin" : "Customer";
    const verified = user?.isVerified ? "Yes" : "No";

    const handleDeleteAccount = async () => {
        if (!user) return;

        try {
            const response = await fetch(`https://final-project-api-q0ob.onrender.com/users/delete/${user.userId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete account");
            }

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }

            alert("Account deleted successfully.");
            localStorage.removeItem("myUser");
            localStorage.removeItem("myToken");
            setShowDeleteModal(false);
            navigate("/login");
        } catch (error) {
            console.error("Error deleting account:", error);
            alert("An error occurred while deleting your account. Please try again later.");
        }
    };

    const handleEditProfile = () => {
        setShowEditModal(true);
    };

    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            const response = await fetch(`https://final-project-api-q0ob.onrender.com/users/update/${user.userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to update account");
            }

            const updatedUser = await response.json();
            localStorage.setItem("myUser", JSON.stringify(updatedUser));
            setShowEditModal(false);
            toast.success("Profile updated successfully.", {
                position: "top-center",
                autoClose: 100000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
            window.location.reload();
        } catch (error) {
            console.error("Error updating profile:", error);
            toast("Failed to update profile. Please try again.");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    if (showLoginModal) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="w-full max-w-sm p-6 text-center bg-white rounded-md shadow-md">
                    <h2 className="mb-4 text-xl font-semibold text-purple-700">Login Required</h2>
                    <p className="mb-6 text-gray-700">You must be logged in to view your profile.</p>
                    <button
                        onClick={() => navigate("/login")}
                        className="px-6 py-2 text-white transition bg-purple-600 rounded hover:bg-purple-700"
                    >
                        OK
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative max-w-4xl p-6 mx-auto mt-24 bg-white shadow-lg rounded-xl">
            <ToastContainer />
            <button
                onClick={() => navigate("/")}
                className="absolute flex items-center gap-2 text-purple-700 transition-colors cursor-pointer top-4 left-4 hover:text-purple-900"
            >
                <ArrowLeft size={20} />
                <span className="text-sm font-medium">Back</span>
            </button>
            <div className="flex flex-col items-center mb-8">
                <div className="flex items-center justify-center w-24 h-24 mb-4 text-3xl font-bold text-white bg-purple-600 rounded-full">
                    {initials}
                </div>
                <h2 className="text-2xl font-bold text-purple-700">{fullName}</h2>
                <p className="text-gray-500">{user?.email}</p>
            </div>
            <div className="grid w-full grid-cols-1 gap-6 mb-8 sm:grid-cols-2">
                <ProfileField label="Phone Number" value={user?.contactPhone || "N/A"} />
                <ProfileField label="Address" value={user?.address || "N/A"} />
                <ProfileField label="Account Type" value={accountType} />
                <ProfileField label="Verified" value={verified} />
            </div>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <button
                    onClick={handleEditProfile}
                    className="px-6 py-2 font-semibold text-white transition bg-yellow-500 rounded-md cursor-pointer hover:bg-yellow-600"
                >
                    Edit Profile
                </button>
                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-6 py-2 font-semibold text-white transition bg-red-600 rounded-md cursor-pointer hover:bg-red-700"
                >
                    Delete Account
                </button>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                        <h3 className="mb-4 text-xl font-bold text-red-600">Confirm Account Deletion</h3>
                        <p className="mb-6 text-gray-700">
                            Are you sure you want to delete your account? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-gray-700 transition border rounded cursor-pointer hover:border-purple-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="px-4 py-2 text-white transition bg-red-600 rounded cursor-pointer hover:bg-red-700"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
                        <h3 className="mb-4 text-xl font-bold text-purple-700">Edit Profile</h3>
                        <form onSubmit={handleUpdateSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="p-2 text-gray-700 border rounded"
                                required
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="p-2 text-gray-700 border rounded"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="col-span-2 p-2 text-gray-700 border rounded"
                                required
                                disabled
                            />
                            <input
                                type="text"
                                name="phoneNumber"
                                placeholder="Phone Number"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="p-2 text-gray-700 border rounded"
                            />
                            <input
                                type="text"
                                name="address"
                                placeholder="Address"
                                value={formData.address}
                                onChange={handleChange}
                                className="col-span-2 p-2 text-gray-700 border rounded"
                            />
                            <div className="flex justify-end col-span-2 gap-4 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 text-gray-700 border rounded hover:border-purple-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const ProfileField = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col justify-end w-full align-center">
        <span className="self-center text-sm text-gray-500">{label}</span>
        <span className="self-center text-lg font-medium text-gray-800">{value}</span>
    </div>
);

export default Profile;
