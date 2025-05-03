
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Newsletter = () => {
  return (
    <div className="py-12 bg-[#d0e0ec]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/4 mb-6 md:mb-0">

          </div>
          
          <div className="md:w-7/12">
            <h2 className="text-2xl font-bold mb-2">Newsletter</h2>
            <p className="text-gray-700 mb-6">
              Subscribe To Our Newsletter Get Bonus For The Next Purchase
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Input 
                type="email" 
                placeholder="Your Email Address" 
                className="bg-white"
              />
              <Button className="bg-[#39536f] hover:bg-[#2a405a]">
                Subscribe
              </Button>
            </div>
          </div>
          
          <div className="md:w-1/4 hidden md:block">
            <img 
              src="/lovable-uploads/mobile.png" 
              loading="lazy"

              alt="Newsletter" 
              className="max-h-[200px] object-cover rounded-lg ml-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
