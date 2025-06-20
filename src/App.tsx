
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/auth';
import { SearchProvider } from '@/contexts/search';
import { CartProvider } from '@/contexts/cart';
import Index from '@/pages/Index';
import Shop from '@/pages/Shop';
import ProductDetail from '@/pages/ProductDetail';
import Profile from '@/pages/Profile';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import ForgotPassword from '@/pages/ForgotPassword';
import Admin from '@/pages/Admin';
import Cart from '@/pages/Cart';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WishlistProvider } from '@/contexts/wishlist';
import { ComparisonProvider } from '@/contexts/comparison';
import Compare from '@/pages/Compare';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ComparisonProvider>
                <SearchProvider>
                  <div className="min-h-screen bg-background font-sans antialiased">
                    <Toaster />
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<SignUp />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/compare" element={<Compare />} />
                    </Routes>
                  </div>
                </SearchProvider>
              </ComparisonProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
