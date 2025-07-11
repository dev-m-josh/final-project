import React from "react";
import { Users, Award, Globe, Heart, Target, Shield, Clock, Star } from "lucide-react";
import { NavLink } from "react-router-dom";

const AboutPage = () => {
    const stats = [
        { number: "2M+", label: "Happy Travelers", icon: Users },
        { number: "10,000+", label: "Partner Hotels", icon: Award },
        { number: "150+", label: "Countries", icon: Globe },
        { number: "99.9%", label: "Customer Satisfaction", icon: Heart },
    ];

    const values = [
        {
            icon: Target,
            title: "Our Mission",
            description:
                "To make travel accessible and enjoyable for everyone by connecting travelers with the perfect accommodations worldwide.",
        },
        {
            icon: Shield,
            title: "Trust & Security",
            description:
                "We prioritize your safety and security with industry-leading encryption and verified hotel partnerships.",
        },
        {
            icon: Clock,
            title: "Always Available",
            description: "Our 24/7 customer support team is here to help you before, during, and after your travels.",
        },
        {
            icon: Star,
            title: "Excellence",
            description: "We continuously strive to exceed expectations and deliver exceptional booking experiences.",
        },
    ];

    const team = [
        {
            name: "Sarah Johnson",
            role: "CEO & Founder",
            image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
            description: "Former hospitality executive with 15+ years of experience in the travel industry.",
        },
        {
            name: "Michael Chen",
            role: "CTO",
            image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400",
            description: "Tech visionary who led engineering teams at major travel platforms before joining BookStay.",
        },
        {
            name: "Emily Rodriguez",
            role: "Head of Customer Experience",
            image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
            description: "Customer service expert dedicated to ensuring every traveler has an amazing experience.",
        },
        {
            name: "David Kim",
            role: "Head of Partnerships",
            image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
            description: "Relationship builder who works with hotels worldwide to expand our accommodation network.",
        },
    ];

    return (
        <section id="about" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="text-center mb-20">
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">About BookStay</h1>
                    <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        Founded in 2024, BookStay has revolutionized the way people discover and book accommodations. We
                        believe that finding the perfect place to stay should be simple, secure, and inspiring.
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center group">
                            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors duration-300">
                                <stat.icon className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                            <div className="text-gray-600">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Story Section */}
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                        <div className="space-y-4 text-gray-600 leading-relaxed">
                            <p>
                                BookStay was born from a simple frustration: booking hotels shouldn't be complicated,
                                expensive, or unreliable. Our founders, experienced travelers themselves, noticed that
                                the hotel booking industry was fragmented and often put profits before people.
                            </p>
                            <p>
                                We set out to change that by creating a platform that prioritizes transparency,
                                competitive pricing, and exceptional customer service. Today, we're proud to be the
                                trusted choice for millions of travelers worldwide.
                            </p>
                            <p>
                                From budget-friendly hostels to luxury resorts, we partner with accommodations that meet
                                our high standards for quality, service, and value. Every hotel in our network is
                                carefully vetted to ensure you have the best possible experience.
                            </p>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl transform rotate-3"></div>
                        <img
                            src="https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800"
                            alt="Team collaboration"
                            className="relative z-10 w-full h-80 object-cover rounded-2xl shadow-xl"
                        />
                    </div>
                </div>

                {/* Values Section */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            These core principles guide everything we do and shape how we serve our customers.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="text-center group">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
                                    <value.icon className="h-10 w-10 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team Section */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            The passionate people behind BookStay who work tirelessly to make your travel dreams come
                            true.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <div key={index} className="text-center group">
                                <div className="relative mb-6">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-32 h-32 rounded-full object-cover mx-auto shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                                    />
                                    <div className="absolute inset-0 bg-blue-600 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                                <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mission Statement */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 lg:p-12 text-center text-white">
                    <h2 className="text-3xl font-bold mb-6">Our Commitment to You</h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
                        We're committed to making travel more accessible, affordable, and enjoyable for everyone.
                        Whether you're planning a weekend getaway or a month-long adventure, we're here to help you find
                        the perfect place to stay.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <NavLink
                            to="/register"
                            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
                            Start Your Journey
                        </NavLink>
                        <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200">
                            Contact Us
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutPage;
