
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex">
        <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row">
          {/* Left Side - Form */}
          <div className="flex-1 md:pr-8">
            <h1 className="text-4xl font-bold mb-2">Log In</h1>
            <p className="text-lg text-gray-700 mb-8">
              Log Into Your Account And Enjoy A Faster Checkout.
            </p>
            
            <form className="space-y-6">
              <div>
                <label htmlFor="email" className="block font-medium mb-1">Username Or Email Address</label>
                <Input 
                  id="email" 
                  type="text" 
                  placeholder="Insert Username / Email Address Here" 
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
              
              <div className="text-right">
                <Link to="/forgot-password" className="text-gray-600 hover:text-[#39536f] hover:underline">
                  Lost Your Password?
                </Link>
              </div>
              
              <Button 
                type="submit" 
                className="w-full py-6 bg-[#39536f] hover:bg-[#2a405a]"
              >
                <LogIn className="mr-2 h-5 w-5" /> Log In
              </Button>
              
              <div className="text-center">
                <span className="text-gray-600">Don't Have An Account? </span>
                <Link to="/signup" className="text-[#39536f] hover:underline font-medium">
                  Sign Up
                </Link>
              </div>
            </form>
          </div>
          
          {/* Right Side - Image */}
          <div className="hidden md:block flex-1 mt-10 md:mt-0">
            <div className="h-full rounded-3xl overflow-hidden bg-[#dbe7f0]">
              <img 
                src="/lovable-uploads/login.png" 
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

export default Login;
