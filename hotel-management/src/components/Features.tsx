import React from 'react';
import { Calendar, CreditCard, MessageSquare, BarChart3, Smartphone, Settings } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Easy Booking',
      description: 'Search, compare, and book hotels instantly with real-time availability and instant confirmations.',
      image: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      icon: CreditCard,
      title: 'Secure Payments',
      description: 'Safe and secure payment processing with multiple payment options and fraud protection.',
      image: 'https://images.pexels.com/photos/4386476/pexels-photo-4386476.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      icon: MessageSquare,
      title: '24/7 Support',
      description: 'Round-the-clock customer support to help you with bookings, changes, and travel assistance.',
      image: 'https://images.pexels.com/photos/4386490/pexels-photo-4386490.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      icon: BarChart3,
      title: 'Best Price Guarantee',
      description: 'Compare prices across multiple platforms and get the best deals with our price matching guarantee.',
      image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      icon: Smartphone,
      title: 'Mobile App',
      description: 'Book and manage your reservations on the go with our user-friendly mobile apps.',
      image: 'https://images.pexels.com/photos/4386443/pexels-photo-4386443.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      icon: Settings,
      title: 'Flexible Options',
      description: 'Free cancellation, room upgrades, and flexible booking options to suit your travel needs.',
      image: 'https://images.pexels.com/photos/4386339/pexels-photo-4386339.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Book With Us?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the benefits of booking your next stay with our platform.
            We make travel planning simple, secure, and rewarding.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-blue-600 rounded-2xl p-8 lg:p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Book Your Next Adventure?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join millions of travelers who trust us to find and book their perfect accommodations worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              Search Hotels Now
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200">
              Download App
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;