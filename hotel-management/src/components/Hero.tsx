import React from "react";
import { NavLink } from "react-router-dom";
import { ArrowRight, Calendar, Users, Star } from "lucide-react";

const Hero = () => {
    return (
        <section id="home" className="pt-16 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-fit">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
                    {/* Content */}
                    <div className="lg:col-span-6">
                        <div className="text-center lg:text-left">
                            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                                Find & Book Your <span className="text-blue-600">Perfect Stay</span> Anywhere
                            </h1>
                            <p className="mt-6 text-xl text-gray-600 max-w-3xl">
                                Discover amazing hotels worldwide and book your perfect room with ease. Compare prices,
                                read reviews, and enjoy seamless booking experiences.
                            </p>

                            {/* Stats */}
                            <div className="mt-8 flex justify-center lg:justify-start space-x-8">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600">10,000+</div>
                                    <div className="text-sm text-gray-600">Hotels Available</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600">2M+</div>
                                    <div className="text-sm text-gray-600">Happy Travelers</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600">150+</div>
                                    <div className="text-sm text-gray-600">Countries</div>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <NavLink to="/hotels" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center group">
                                    Search Hotels
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                                </NavLink>
                                <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors duration-200">
                                    Browse Deals
                                </button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                    <span>4.8/5 Customer Rating</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    <span>Free Cancellation</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Users className="h-4 w-4 mr-1" />
                                    <span>Instant Confirmation</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="lg:col-span-6 mt-12 lg:mt-0">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl transform rotate-3"></div>
                            <img
                                src="https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800"
                                alt="Modern hotel lobby"
                                className="relative z-10 w-full h-96 object-cover rounded-2xl shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
