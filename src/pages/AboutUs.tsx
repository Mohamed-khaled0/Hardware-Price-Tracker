
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-[#39536f]">About TECO</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-[#39536f]">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Founded in 2015, TECO was born out of a passion for making high-quality technology accessible to everyone. 
                What started as a small online store has grown into a trusted destination for tech enthusiasts and everyday consumers alike.
              </p>
              <p className="text-gray-700">
                Our journey began with a simple mission: to provide customers with reliable tech products at fair prices, 
                backed by exceptional service. This mission continues to guide everything we do.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Team working" 
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#39536f]">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-xl mb-2">Quality</h3>
                <p className="text-gray-600">We curate only the best products that meet our high standards for performance and reliability.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-xl mb-2">Integrity</h3>
                <p className="text-gray-600">We believe in transparent pricing, honest product descriptions, and keeping our promises.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-xl mb-2">Customer Focus</h3>
                <p className="text-gray-600">Your satisfaction drives our business. We're committed to providing outstanding service at every step.</p>
              </div>
            </div>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-[#39536f]">What Sets Us Apart</h2>
            <ul className="list-disc pl-5 space-y-3 text-gray-700">
              <li>Carefully selected products from trusted global brands</li>
              <li>Expert support team ready to help with any questions</li>
              <li>Fast shipping and hassle-free returns</li>
              <li>Regular deals and special offers for our loyal customers</li>
              <li>Commitment to reducing our environmental footprint</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-[#39536f]">Join Our Journey</h2>
            <p className="text-gray-700 mb-6">
              We're constantly evolving to meet the changing needs of our customers and the tech landscape. 
              As we continue to grow, we remain dedicated to our founding principles and to building lasting 
              relationships with the people who shop with us.
            </p>
            <p className="text-gray-700">
              Thank you for choosing TECO. We're excited to have you as part of our community.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
