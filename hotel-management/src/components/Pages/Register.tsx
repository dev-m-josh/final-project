import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../../features/authSlice";

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [code, setCode] = useState("");
    const [showVerificationForm, setShowVerificationForm] = useState(false);

    // Password toggle
    const togglePassword = () => setShowPassword((prev) => !prev);
    const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

    //submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage("");

        if (!email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
            setErrorMessage("Invalid email address!");
            return;
        }

        if (!phoneNumber.match(/^07\d{8}$/)) {
            setErrorMessage("Invalid phone number!");
            return;
        }

        if (password.length < 6) {
            setErrorMessage("Password should be at least 6 characters long");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match!");
            return;
        }

        const userDetails = {
            firstname: firstName,
            lastname: lastName,
            email,
            contactPhone: phoneNumber,
            address,
            password,
            isAdmin: false,
        };

        try {
            const response = await axios.post(
                "https://final-project-api-q0ob.onrender.com/auth/register",
                userDetails,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status !== 201) {
                setErrorMessage(response.data.message || "Registration failed");
                return;
            }

            console.log("Registration successful:", response.data);
            const user = response.data.user;
            const token = response.data.token;
            dispatch(login({ ...user, token }));

            console.log(localStorage.getItem("myUser"));
            console.log(localStorage.getItem("myToken"));

            // Reset form
            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setPhoneNumber("");
            setAddress("");

            setShowVerificationForm(true);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error("Registration error:", error.response?.data);
                alert(error.response?.data?.error || "Registration failed");
            } else {
                console.error("Unexpected error:", error);
                alert("An unexpected error occurred");
            }
        }
    };

    const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage("");
        const user = localStorage.getItem("myUser");
        const email = user ? JSON.parse(user).email : "";
        console.log(email)

        try {
            const response = await axios.post("https://final-project-api-q0ob.onrender.com/auth/verify", {
                email,
                code,
            });

            if (response.status === 200) {
                window.location.reload(); // reflect changes immediately
                navigate("/");
            } else {
                setErrorMessage(response.data.message || "Verification failed");
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error("Verification error:", error.response?.data);
                setErrorMessage(error.response?.data?.error || "Verification failed");
            } else {
                console.error("Unexpected error:", error);
                setErrorMessage("An unexpected error occurred");
            }
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-20">
            <div className="max-w-150 w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                {!showVerificationForm ? (
                    <>
                        <div>
                            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign Up</h2>
                        </div>
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            <div className="flex align-center justify-center gap-6">
                                <div className="w-full">
                                    <label htmlFor="firstName" className="block text-bg font-medium text-gray-700">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        value={firstName}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setFirstName(value.charAt(0).toUpperCase() + value.slice(1));
                                        }}
                                        required
                                        className="mt-1 text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                                <div className="w-full">
                                    <label htmlFor="lastName" className="block text-bg font-medium text-gray-700">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        value={lastName}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setLastName(value.charAt(0).toUpperCase() + value.slice(1));
                                        }}
                                        required
                                        className="mt-1 text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="phoneNumber" className="block text-bg font-medium text-gray-700">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    required
                                    className="mt-1 text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-bg font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="mt-1 text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="address" className="block text-bg font-medium text-gray-700">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                    className="mt-1 text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-bg font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="relative mt-1">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pr-10 mt-1 text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePassword}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-black cursor-pointer sm:h-5 sm:w-5" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-black cursor-pointer sm:h-5 sm:w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-bg font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <div className="relative mt-1">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="pr-10 mt-1 text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleConfirmPassword}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4 text-black cursor-pointer sm:h-5 sm:w-5" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-black cursor-pointer sm:h-5 sm:w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {errorMessage && <div className="text-red-600 text-sm text-center">{errorMessage}</div>}

                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    If you already have an account,{" "}
                                    <button
                                        type="button"
                                        onClick={() => navigate("/login")}
                                        className="text-purple-600 hover:text-purple-700 underline cursor-pointer"
                                    >
                                        Login
                                    </button>
                                </p>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full bg-purple-800 hover:bg-purple-700 cursor-pointer text-white font-semibold px-4 py-2 rounded-md transition-colors duration-300 shadow-lg"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <div className="flex flex-col items-center justify-center min-h-screen">
                            <h2 className="text-center text-3xl font-extrabold text-gray-900">
                                Enter Verification Code
                            </h2>
                            <form className="mt-8 space-y-6" onSubmit={handleVerify}>
                                <div>
                                    <label htmlFor="verificationCode" className="block font-medium text-gray-700">
                                        Verification Code
                                    </label>
                                    <input
                                        type="text"
                                        id="verificationCode"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        placeholder="Enter your verification code..."
                                        required
                                        className="mt-1 text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                                {errorMessage && <div className="text-red-600 text-sm text-center">{errorMessage}</div>}
                                <div>
                                    <button
                                        type="submit"
                                        className="w-full bg-purple-800 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-md transition-colors duration-300 shadow-lg"
                                    >
                                        Verify
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Register;
