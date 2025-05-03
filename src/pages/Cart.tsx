
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash } from "lucide-react";

// Mock cart data - in a real app, this would come from context or state management
const cartItems = [
  {
    id: 1,
    name: "Samsung Q60b 65 Inch 4k Uhd Smart Qled Tv With Built In Receiver",
    price: 31666,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1601944177325-f8867652837f?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Honor X5 Plus Dual Sim - 64GB, 4GB RAM, 4G - Black",
    price: 5750,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=200&auto=format&fit=crop"
  }
];

const Cart = () => {
  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-[#39536f]">My Cart</h1>
        <p className="text-gray-600 mb-8">You Have {cartItems.length} Items In Your Cart</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items - Takes up more space */}
          <div className="lg:col-span-8">
            {cartItems.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="w-[100px]">Image</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="w-[100px] text-right">Price</TableHead>
                      <TableHead className="w-[100px] text-center">Quantity</TableHead>
                      <TableHead className="w-[100px] text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="w-24 h-24 rounded border overflow-hidden">
                            <img 
                              src={item.image} 
                              loading="lazy"
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">{item.price.toLocaleString()} EGP</TableCell>
                        <TableCell className="text-center">
                          <div className="relative inline-block">
                            <select 
                              defaultValue={item.quantity} 
                              className="appearance-none border rounded py-2 px-4 pr-8 bg-white"
                            >
                              {[1, 2, 3, 4, 5].map(num => (
                                <option key={num} value={num}>{num}</option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <button className="text-red-500 hover:text-red-700 flex items-center justify-end gap-1 w-full">
                            Remove <Trash className="h-4 w-4" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="bg-white p-8 text-center rounded-lg shadow-sm">
                <h3 className="text-xl font-medium mb-4">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
                <Link 
                  to="/shop" 
                  className="inline-block bg-[#39536f] text-white px-6 py-3 rounded-md font-medium hover:bg-[#2a405a]"
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </div>
        
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
