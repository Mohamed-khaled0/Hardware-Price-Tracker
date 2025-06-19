
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/auth';
import { SearchProvider } from '@/contexts/search';
import Shop from '@/pages/Shop';
import ProductDetail from '@/pages/ProductDetail';
import Profile from '@/pages/Profile';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import ForgotPassword from '@/pages/ForgotPassword';
import UpdatePassword from '@/pages/UpdatePassword';
import Admin from '@/pages/Admin';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WishlistProvider } from '@/contexts/wishlist';
import { ComparisonProvider } from '@/contexts/comparison';
import Compare from '@/pages/Compare';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WishlistProvider>
        <ComparisonProvider>
          <AuthProvider>
            <SearchProvider>
              <BrowserRouter>
                <div className="min-h-screen bg-background font-sans antialiased">
                  <Toaster />
                  <Routes>
                    <Route path="/" element={<Shop />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<SignUp />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/update-password" element={<UpdatePassword />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/compare" element={<Compare />} />
                  </Routes>
                </div>
              </BrowserRouter>
            </SearchProvider>
          </AuthProvider>
        </ComparisonProvider>
      </WishlistProvider>
    </QueryClientProvider>
  );
}

export default App;
