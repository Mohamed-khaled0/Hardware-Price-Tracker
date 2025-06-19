
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useSearch } from '@/contexts/search';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, Search, User, Heart } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useWishlist } from '@/contexts/wishlist';
import { useComparison } from '@/contexts/comparison';

const Header = () => {
  const { user, signOut, profile } = useAuth();
  const { currentSearch, setCurrentSearch } = useSearch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { getItemCount } = useWishlist();
  const { getItemCount: getComparisonCount } = useComparison();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSearch(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/shop?search=${currentSearch}`);
  };

  return (
    <div className="relative">
      {/* Announcement Bar */}
      <div className="bg-[#39536f] text-white text-center py-2">
        Free shipping on orders over $50!
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold tracking-tight">
                <span className="text-[#39536f]">E</span>
                <span className="text-[#6f7d95]">-Commerce</span>
              </h1>
            </Link>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-[#39536f] px-3 py-2 text-sm font-medium">
                Home
              </Link>
              <Link to="/shop" className="text-gray-700 hover:text-[#39536f] px-3 py-2 text-sm font-medium">
                Shop
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-[#39536f] px-3 py-2 text-sm font-medium">
                About
              </Link>
              <Link 
                to="/compare" 
                className="text-gray-700 hover:text-[#39536f] px-3 py-2 text-sm font-medium transition-colors relative"
              >
                Compare
                {getComparisonCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getComparisonCount()}
                  </span>
                )}
              </Link>
            </nav>

            {/* Search and User Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <Input
                    type="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Search"
                    value={currentSearch}
                    onChange={handleSearchChange}
                  />
                </div>
              </form>

              {/* Wishlist Icon */}
              <Link to="/cart" className="text-gray-700 hover:text-[#39536f] relative p-2">
                <Heart className="h-6 w-6" />
                {getItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getItemCount()}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" className="rounded-full p-1 hover:bg-gray-100">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={profile?.avatar_url} />
                          <AvatarFallback>{profile?.username?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80">
                      <SheetHeader>
                        <SheetTitle>User Profile</SheetTitle>
                        <SheetDescription>
                          Manage your account settings and preferences.
                        </SheetDescription>
                      </SheetHeader>
                      <div className="grid gap-4 py-4">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={profile?.avatar_url} />
                            <AvatarFallback>{profile?.username?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium leading-none">{profile?.username || user.email}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <Link to="/profile" className="block text-gray-700 hover:text-[#39536f] px-3 py-2 text-sm font-medium">
                          Edit Profile
                        </Link>
                        <Button variant="destructive" size="sm" onClick={signOut}>
                          Sign Out
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              ) : (
                <Link to="/login" className="text-gray-700 hover:text-[#39536f] px-3 py-2 text-sm font-medium">
                  Log In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu */}
          <div className="md:hidden">
            <div className="flex items-center justify-between">
              {/* Mobile Menu Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open sidebar</span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-64">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription>
                      Explore our site.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-4 py-4">
                    <Link to="/" className="block text-gray-700 hover:text-[#39536f] px-3 py-2 text-sm font-medium">
                      Home
                    </Link>
                    <Link to="/shop" className="block text-gray-700 hover:text-[#39536f] px-3 py-2 text-sm font-medium">
                      Shop
                    </Link>
                    <Link to="/about" className="block text-gray-700 hover:text-[#39536f] px-3 py-2 text-sm font-medium">
                      About
                    </Link>
                     <Link to="/cart" className="block text-gray-700 hover:text-[#39536f] px-3 py-2 text-sm font-medium relative">
                      Wishlist
                      {getItemCount() > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {getItemCount()}
                        </span>
                      )}
                    </Link>
                    <Link 
                      to="/compare" 
                      className="text-gray-700 hover:text-[#39536f] px-3 py-2 text-sm font-medium transition-colors relative"
                    >
                      Compare
                      {getComparisonCount() > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {getComparisonCount()}
                        </span>
                      )}
                    </Link>
                    {user ? (
                      <>
                        <Link to="/profile" className="block text-gray-700 hover:text-[#39536f] px-3 py-2 text-sm font-medium">
                          Edit Profile
                        </Link>
                        <Button variant="destructive" size="sm" onClick={signOut}>
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <Link to="/login" className="block text-gray-700 hover:text-[#39536f] px-3 py-2 text-sm font-medium">
                        Log In
                      </Link>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
