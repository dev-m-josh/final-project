import React from 'react';
import { Shield, Zap, Users, BarChart, Clock, Globe, CalendarCheck, Star } from 'lucide-react';

const WhyChooseUs = () => {
  const benefits = [
      {
          icon: Shield,
          title: "Secure Booking",
          description: "Your personal and payment information is protected with bank-level security and encryption.",
          color: "bg-green-100 text-green-600",
      },
      {
          icon: Zap,
          title: "Instant Confirmation",
          description: "Get immediate booking confirmations and e-tickets sent directly to your email.",
          color: "bg-yellow-100 text-yellow-600",
      },
      {
          icon: Users,
          title: "24/7 Customer Care",
          description: "Our dedicated support team is available around the clock to assist with your bookings.",
          color: "bg-blue-100 text-blue-600",
      },
      {
          icon: BarChart,
          title: "Best Prices",
          description: "Compare prices from multiple sources and get exclusive deals you won't find elsewhere.",
          color: "bg-purple-100 text-purple-600",
      },
      {
          icon: Clock,
          title: "Flexible Booking",
          description: "Free cancellation on most bookings and easy modification options for your convenience.",
          color: "bg-red-100 text-red-600",
      },
      {
          icon: Globe,
          title: "Global Coverage",
          description: "Access to hotels in 150+ countries with local support and currency options.",
          color: "bg-indigo-100 text-indigo-600",
      },
      {
          icon: CalendarCheck,
          title: "Easy Check-In",
          description: "Skip the front desk with digital check-in options at select hotels for a smooth arrival.",
          color: "bg-orange-100 text-orange-600",
      },
      {
          icon: Star,
          title: "Verified Reviews",
          description: "Read trusted reviews from real guests to help you choose the perfect stay with confidence.",
          color: "bg-teal-100 text-teal-600",
      },
  ];

  return (
    <section id="why-choose-us" className="py-20 bg-white w-full">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose BookStay?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join millions of travelers worldwide who trust BookStay for their accommodation needs
            and enjoy seamless booking experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-16 h-16 ${benefit.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <benefit.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Section */}
        <div className="mt-10 bg-gray-50 rounded-2xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Trusted by Millions of Travelers
              </h3>
              <p className="text-gray-600 mb-8">
                From solo adventurers to family vacations, our platform serves travelers of all kinds
                with reliable booking services and exceptional customer care.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                  <span className="text-sm font-medium text-gray-700">SSL Secured</span>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                  <span className="text-sm font-medium text-gray-700">PCI Compliant</span>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                  <span className="text-sm font-medium text-gray-700">99.9% Uptime</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Hotel reception desk"
                className="w-full h-64 object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;