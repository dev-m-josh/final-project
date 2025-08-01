import { useState, useEffect } from "react";
import { Menu, X, Hotel } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/authSlice";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const token = localStorage.getItem("myToken");
    const user = JSON.parse(localStorage.getItem("myUser") || "{}");
    const isAdmin = user.isAdmin;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoggedIn(!!token);
    }, [token, user]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch(logout());
        setIsLoggedIn(false);
        setIsMenuOpen(false);
        navigate("/login");
    };

    const getLinkClass = ({ isActive }: { isActive: boolean }) =>
        `${
            isActive ? "text-purple-600 underline" : "text-gray-700 hover:text-purple-600"
        } text-base lg:text-lg font-semibold transition-colors`;

    return (
        <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Hotel className="h-8 w-8 text-blue-600" />
                        <span className="ml-2 text-xl font-bold text-gray-800">HotelPro</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="flex items-baseline space-x-8">
                            <NavLink to="/" className={getLinkClass} data-testid="home-desktop">
                                Home
                            </NavLink>
                            <NavLink to="/about" className={getLinkClass} data-testid="about-desktop">
                                About
                            </NavLink>
                            <NavLink to="/hotels" className={getLinkClass} data-testid="hotels-desktop">
                                Hotels
                            </NavLink>
                            {isLoggedIn && (
                                <NavLink to="/dashboard" className={getLinkClass} data-testid="dashboard-desktop">
                                    Dashboard
                                </NavLink>
                            )}
                            {isAdmin && (
                                <NavLink to="/admin" className={getLinkClass} data-testid="admin-desktop">
                                    Admin
                                </NavLink>
                            )}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="hidden lg:flex items-center space-x-4">
                        {isLoggedIn ? (
                            <>
                                <NavLink
                                    to="/profile"
                                    data-testid="profile-desktop"
                                    className="px-4 py-2 border rounded-md text-gray-700 hover:border-purple-600 transition-colors"
                                >
                                    Profile
                                </NavLink>
                                <button
                                    onClick={handleLogout}
                                    data-testid="logout-desktop"
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink
                                    to="/login"
                                    data-testid="login-desktop"
                                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                                >
                                    Login
                                </NavLink>
                                <NavLink
                                    to="/register"
                                    data-testid="register-desktop"
                                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                                >
                                    Register
                                </NavLink>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            data-testid="mobile-menu-toggle"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                            {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="lg:hidden px-4 pb-4 space-y-2 bg-white shadow-md">
                    <NavLink
                        data-testid="home-mobile"
                        to="/"
                        className={`${getLinkClass} block text-black`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/about"
                        data-testid="about-mobile"
                        className={`${getLinkClass} block text-black`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        About
                    </NavLink>
                    <NavLink
                        data-testid="hotels-mobile"
                        to="/hotels"
                        className={`${getLinkClass} block text-black`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Hotels
                    </NavLink>
                    {isLoggedIn && (
                        <NavLink
                            data-testid="dashboard-mobile"
                            to="/dashboard"
                            className={`${getLinkClass} block text-black`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Dashboard
                        </NavLink>
                    )}
                    {isAdmin && (
                        <NavLink
                            data-testid="admin-mobile"
                            to="/admin"
                            className={`${getLinkClass} block text-black`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Admin
                        </NavLink>
                    )}

                    {isLoggedIn ? (
                        <>
                            <NavLink
                                to="/profile"
                                data-testid="profile-mobile"
                                className="block border px-4 py-2 rounded text-gray-700 hover:border-purple-500 transition-colors w-full"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Profile
                            </NavLink>
                            <button
                                onClick={handleLogout}
                                data-testid="logout-mobile"
                                className="block w-full text-left bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink
                                to="/profile"
                                data-testid="profile-mobile"
                                className="block border px-4 py-2 rounded text-gray-700 hover:border-purple-500 transition-colors w-full"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Profile
                            </NavLink>
                            <NavLink
                                to="/login"
                                data-testid="login-mobile"
                                className="block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Login
                            </NavLink>
                            <NavLink
                                to="/register"
                                data-testid="register-mobile"
                                className="block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Register
                            </NavLink>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
