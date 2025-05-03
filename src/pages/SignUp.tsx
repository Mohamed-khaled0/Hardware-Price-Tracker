
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, User } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex">
        <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row">
          {/* Left Side - Form */}
          <div className="flex-1 md:pr-8">
            <h1 className="text-4xl font-bold mb-2">Sign Up</h1>
            <p className="text-lg text-gray-700 mb-8">
              Create An Account And Enjoy Fast Easy Checkout, Order Tracking, And Loyalty Points.
            </p>
            
            <form className="space-y-6">
              <div>
                <label htmlFor="username" className="block font-medium mb-1">Username</label>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="Insert Username" 
                  className="w-full bg-gray-200 border-0"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block font-medium mb-1">Email Address</label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Insert Email Address Here" 
                  className="w-full bg-gray-200 border-0"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block font-medium mb-1">Password</label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-gray-200 border-0 pr-10"
                    placeholder="****************"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full py-6 bg-[#39536f] hover:bg-[#2a405a]"
              >
                <User className="mr-2 h-5 w-5" /> Create Account
              </Button>
            </form>
          </div>
          
          {/* Right Side - Image */}
          <div className="hidden md:block flex-1 mt-10 md:mt-0">
            <div className="h-full rounded-3xl overflow-hidden bg-[#dbe7f0]">
              <img 
                src="/lovable-uploads/login.webp" 
                loading="lazy"
                alt="Modern tablet device" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SignUp;
