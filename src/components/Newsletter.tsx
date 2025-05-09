import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    const { error } = await supabase.from("newsletters").insert({ email });
    if (error) {
      setStatus("error");
    } else {
      setStatus("success");
      setEmail("");
    }
  };

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
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
              <Input 
                type="email" 
                placeholder="Your Email Address" 
                className="bg-white"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={status === "loading"}
              />
              <Button 
                className="bg-[#39536f] hover:bg-[#2a405a]"
                type="submit"
                disabled={status === "loading"}
              >
                Subscribe
              </Button>
            </form>
            {status === "success" && (
              <div className="mt-2 text-green-600 font-medium">
                You are now subscribed!
              </div>
            )}
            {status === "error" && (
              <div className="mt-2 text-red-600 font-medium">
                Something went wrong. Please try again.
              </div>
            )}
          </div>
          
          <div className="md:w-1/4 hidden md:block">
            <img 
              src="/lovable-uploads/mobile.webp" 
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
