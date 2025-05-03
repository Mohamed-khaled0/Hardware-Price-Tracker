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
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-[#39536f]">About Hardware Price Tracker</h1>
          
          {/* Intro Section */}
          <div className="mb-12">
            <p className="text-gray-700 mb-4">
              At <span className="font-semibold text-[#39536f]">Hardware Price Tracker</span>, our mission is to empower tech enthusiasts and savvy shoppers to make informed purchasing decisions by delivering real‑time price data and smart insights for electronics.
            </p>
            <p className="text-gray-700">
              We combine robust web scraping technologies with intuitive design and a passion for transparency—so you never miss out on the perfect deal.
            </p>
          </div>

          {/* Our Vision */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#39536f]">Our Vision</h2>
            <p className="text-gray-700">
              Become the go‑to platform for monitoring price trends, uncovering the best deals, and planning your next hardware upgrade.
            </p>
          </div>

          {/* What We Do */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#39536f]">What We Do</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Continuously track and aggregate prices from major eCommerce sites and local brick‑and‑mortar stores.</li>
              <li>Provide instant alerts when prices drop below your set thresholds.</li>
              <li>Offer powerful search, filters, and intelligent comparisons to highlight the best value.</li>
              <li>Soon: AI‑powered price predictions, seasonal buying guides, and a personalized PC building assistant.</li>
            </ul>
          </div>

          {/* Why Choose Us */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#39536f]">Why Choose Us?</h2>
            <p className="text-gray-700">
              We are committed to delivering:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 mt-4">
              <li>Real-time, accurate price tracking so you get the best deals.</li>
              <li>Intuitive, user-friendly interface on all devices.</li>
              <li>Customizable alerts and personalized recommendations.</li>
              <li>Expert insights and future features powered by AI.</li>
            </ul>
          </div>

          {/* Join Us */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-[#39536f]">Join Our Journey</h2>
            <p className="text-gray-700 mb-6">
              We're constantly evolving to meet the changing needs of our customers and the tech landscape. As we continue to grow, we remain dedicated to our founding principles and to building lasting relationships with the people who shop with us.
            </p>
            <p className="text-gray-700">
              Create your free account today and start discovering smarter ways to shop for hardware!
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
