
import React from "react";
import { Button } from "@/components/ui/button";

const PromoBanners = () => {
  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* First banner - Mega Sales */}
        <div className="bg-[#d0e0ec] rounded-lg mb-8">
          <div className="flex flex-col md:flex-row">
            <div className="p-8 md:p-12 md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Mega Sales Extravaganza!</h2>
              <p className="text-gray-700 mb-6">
                Unbelievable Deals And Massive Discounts Await You At Our Mega Sales Extravaganza
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-[#39536f] hover:bg-[#2a405a]">Start Shopping</Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="/lovable-uploads/iphoneHero.png" 
                alt="Mega sales" 
                className="h-[300px] object-contain mx-auto"
              />
            </div>
          </div>
        </div>

        {/* Two-column banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Laptop Surface Pro banner */}
          <div className="bg-[#d0e0ec] rounded-lg overflow-hidden">
            <div className="p-8 relative">
              <div className="max-w-[60%]">
                <h3 className="text-2xl font-bold mb-2">Laptop Surface Pro 4 Microsoft</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Get Ready For Unbeatable Deals And Discounts That Will Leave You Amazed
                </p>
                <Button className="bg-[#39536f] hover:bg-[#2a405a]">$699 Or Off</Button>
              </div>
              <img 
                src="/lovable-uploads/display.png" 
                alt="Laptop Surface Pro" 
                className="absolute right-0 bottom-0 max-h-[220px] object-contain"
              />
            </div>
          </div>

          {/* HP Monitor banner */}
          <div className="bg-[#d0e0ec] rounded-lg overflow-hidden">
            <div className="p-8 relative">
              <div className="max-w-[60%]">
                <h3 className="text-2xl font-bold mb-2">Gray HP flat screen monitor</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Limited-Time Mega Deals You Don't Want To Miss! Prep Now For Massive Discounts On A Wide Range Of Products
                </p>
                <Button className="bg-[#39536f] hover:bg-[#2a405a]">Upto 50 Off</Button>
              </div>
              <img 
                src="/lovable-uploads/tablet.png" 
                loading="lazy"

                alt="HP Monitor" 
                className="absolute right-0 bottom-0 max-h-[180px] object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoBanners;
