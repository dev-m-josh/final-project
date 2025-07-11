import React from 'react';
import Hero from '../Hero';
import Features from '../Features';
import WhyChooseUs from '../WhyChooseUs';
import Footer from '../Footer';

export const Home = () => {
  return (
      <div className="min-h-screen bg-white w">
          <Hero />
          <Features />
          <WhyChooseUs />
          <Footer />
      </div>
  );
}
