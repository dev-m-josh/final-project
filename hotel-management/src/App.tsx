import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import { Home } from "./components/Pages/Home";
import NotFound from "./components/Pages/NotFound";
import AboutPage from "./components/Pages/AboutPage";
import Login from "./components/Pages/Login";
import Register from "./components/Pages/Register";
import Profile from "./components/Pages/Profile";
import Hotels from "./components/Pages/Hotels";
import AdminDashboard from "./components/Pages/AdminDash";

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/hotels" element={<Hotels />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default App;
