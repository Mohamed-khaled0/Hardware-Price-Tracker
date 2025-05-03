
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="w-full">
      {/* Top Navigation Bar */}
      <div className="relative bg-white px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img 
              className="h-8 md:h-10 w-auto object-contain" 
              src="/lovable-uploads/logo.png" 
              loading="lazy"
              alt="TECO Logo" 
            />
          </Link>

          {/* Search Bar - Hidden on mobile, shown on larger screens */}
          <div className="hidden md:flex flex-1 max-w-3xl mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                className="w-full pl-10 pr-4 py-3 border-2 border-[#6f7d95] rounded-l-2xl focus:outline-none text-lg"
                type="text" 
                placeholder="Search Product" 
              />
              <button 
                className="absolute right-0 top-0 bottom-0 px-6 bg-[#39536f] text-white font-semibold rounded-r-2xl"
              >
                Search
              </button>
            </div>
          </div>

          {/* Login and Cart Buttons */}
          <div className="flex items-center gap-2">
            <button className="flex items-center bg-[#39536f] text-white rounded-full px-4 py-2">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium">Login</span>
            </button>
            <button className="flex items-center bg-[#39536f] text-white rounded-full px-4 py-2">
              <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="font-semibold">CART (2)</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#39536f] focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile search - visible only on mobile */}
          <div className="md:hidden w-full mt-2">
            <div className="relative w-full flex">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                className="w-full pl-10 pr-4 py-2 border-2 border-[#6f7d95] rounded-l-2xl focus:outline-none"
                type="text" 
                placeholder="Search Product" 
              />
              <button 
                className="px-4 bg-[#39536f] text-white font-semibold rounded-r-2xl"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bg-[#39536f] px-4 md:px-8">
        {/* Desktop menu */}
        <div className="hidden md:flex max-w-7xl mx-auto">
          <nav className="flex">
            <Link to="/" className="text-white font-semibold px-5 py-3 hover:bg-[#2a405a] transition-colors">Home</Link>
            <Link to="/categories" className="text-white font-semibold px-5 py-3 hover:bg-[#2a405a] transition-colors">Categories</Link>
            <Link to="/shop" className="text-white font-semibold px-5 py-3 hover:bg-[#2a405a] transition-colors">Shop</Link>
            <Link to="/about" className="text-white font-semibold px-5 py-3 hover:bg-[#2a405a] transition-colors">About Us</Link>
            <Link to="/last-order" className="text-white font-semibold px-5 py-3 hover:bg-[#2a405a] transition-colors">Last order</Link>
          </nav>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      <div 
        className={cn(
          "md:hidden bg-[#2a405a] transition-all duration-300 ease-in-out overflow-hidden", 
          isMenuOpen ? "max-h-60" : "max-h-0"
        )}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className="text-white block px-3 py-2 font-semibold hover:bg-[#39536f] rounded-md">Home</Link>
          <Link to="/categories" className="text-white block px-3 py-2 font-semibold hover:bg-[#39536f] rounded-md">Categories</Link>
          <Link to="/shop" className="text-white block px-3 py-2 font-semibold hover:bg-[#39536f] rounded-md">Shop</Link>
          <Link to="/about" className="text-white block px-3 py-2 font-semibold hover:bg-[#39536f] rounded-md">About Us</Link>
          <Link to="/last-order" className="text-white block px-3 py-2 font-semibold hover:bg-[#39536f] rounded-md">Last order</Link>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
