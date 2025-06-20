
import React from "react";
import { Button } from "@/components/ui/button";

const PromoBanners = () => {
  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* First banner - Price Comparison */}
        <div className="bg-[#d0e0ec] rounded-lg mb-8">
          <div className="flex flex-col md:flex-row">
            <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Compare Prices & Save Money</h2>
              <p className="text-gray-700 mb-6">
                Find the best deals across multiple retailers and never overpay again.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-[#39536f] hover:bg-[#2a405a]">Start Comparing</Button>
              </div>
            </div>
            <div className="md:w-1/2 hidden md:flex items-end justify-end relative">
              <img 
                src="/lovable-uploads/iphoneHero.webp" 
                alt="Featured products" 
                className="max-h-[180px] md:max-h-[200px] lg:max-h-[300px] object-contain"
              />
            </div>
          </div>
        </div>

        {/* Two-column banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Electronics banner */}
          <div className="bg-[#d0e0ec] rounded-lg overflow-hidden">
            <div className="p-8 relative">
              <div className="max-w-[60%]">
                <h3 className="text-2xl font-bold mb-2">Best Electronics Deals</h3>
                <p className="text-sm text-gray-700 mb-4">
                Compare prices on the latest gadgets and electronics
                </p>
                <Button className="bg-[#39536f] hover:bg-[#2a405a]">Compare Prices</Button>
              </div>
              <img 
                src="/lovable-uploads/camera.webp" 
                alt="Electronics" 
                className="absolute right-0 bottom-0 max-h-[100px] md:max-h-[110px] lg:max-h-[160px] object-contain"
              />
            </div>
          </div>

          {/* Tech Accessories banner */}
          <div className="bg-[#d0e0ec] rounded-lg overflow-hidden">
            <div className="p-8 relative">
              <div className="max-w-[60%]">
                <h3 className="text-2xl font-bold mb-2">Tech Accessories</h3>
                <p className="text-sm text-gray-700 mb-4">
                Find the lowest prices on essential accessories
                </p>
                <Button className="bg-[#39536f] hover:bg-[#2a405a]">Find Deals</Button>
              </div>
              <img 
                src="/lovable-uploads/tablet.webp" 
                loading="lazy"
                alt="Tech Accessories" 
                className="absolute right-0 bottom-0 max-h-[100px] md:max-h-[110px] lg:max-h-[160px] object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoBanners;
