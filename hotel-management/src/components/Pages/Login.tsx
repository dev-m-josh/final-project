import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../features/authSlice";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import type { AppDispatch } from "../../store";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => setShowPassword((prev) => !prev);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage("");

        if (!email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
            setErrorMessage("Invalid email address!");
            return;
        }

        if (password.length < 6) {
            setErrorMessage("Password should be at least 6 characters long");
            return;
        }

        try {
            const response = await axios.post("https://final-project-api-q0ob.onrender.com/auth/login", {
                email,
                password,
            });

            if (response.status === 200) {
                const user = response.data.user;
                const token = response.data.token;
                dispatch(login({ ...user, token }));

                setEmail("");
                setPassword("");
                navigate("/hotels");
            } else {
                setErrorMessage(response.data.message || "Login failed");
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error("Login error:", error.response?.data);
                setErrorMessage(error.response?.data?.error || "Login failed");
            } else {
                console.error("Unexpected error:", error);
                setErrorMessage("An unexpected error occurred");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4 py-12 pt-20 bg-gray-50 sm:px-6 lg:px-8">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">Welcome back</h2>
                </div>
                <button className="flex items-center justify-center w-full gap-0 font-semibold text-black cursor-pointer">
                    <img src="/google.png" alt="Google" className="w-12 h-6" />
                    Continue with Google
                </button>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block font-medium text-gray-700 text-bg">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email..."
                            required
                            className="w-full px-3 py-2 mt-1 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block font-medium text-gray-700 text-bg">
                            Password
                        </label>
                        <div className="relative mt-1">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 pr-10 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                            />
                            <button
                                type="button"
                                onClick={togglePassword}
                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4 text-gray-800 cursor-pointer sm:h-5 sm:w-5" />
                                ) : (
                                    <Eye className="w-4 h-4 text-gray-800 cursor-pointer sm:h-5 sm:w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {errorMessage && <div className="text-sm text-center text-red-600">{errorMessage}</div>}

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/register")}
                                className="text-purple-600 underline cursor-pointer hover:text-purple-700"
                            >
                                Sign Up
                            </button>
                        </p>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 font-semibold text-white transition-colors duration-300 bg-purple-800 rounded-md shadow-lg cursor-pointer hover:bg-purple-700"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
