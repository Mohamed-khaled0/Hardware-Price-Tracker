
import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/cart";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getTotal } = useCart();
  
  // Find best source for each product
  const getBestSource = (productId: string) => {
    const item = items.find(item => item.id === productId);
    
    if (!item?.priceComparisons || item.priceComparisons.length === 0) {
      return null;
    }
    
    return item.priceComparisons.reduce(
      (best, current) => current.price < best.price ? current : best, 
      item.priceComparisons[0]
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-[#39536f]">My Cart</h1>
        <p className="text-gray-600 mb-8">You Have {items.length} Items In Your Cart</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items - Takes up more space */}
          <div className="lg:col-span-8">
            {items.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="w-[100px]">Image</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="w-[100px] text-right">Price</TableHead>
                      <TableHead className="w-[100px] text-center">Quantity</TableHead>
                      <TableHead className="w-[180px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => {
                      const bestSource = getBestSource(item.id);
                      
                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Link to={`/product/${item.product_id}`}>
                              <div className="w-24 h-24 rounded border overflow-hidden">
                                <img 
                                  src={item.thumbnail} 
                                  loading="lazy"
                                  alt={item.title} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </Link>
                          </TableCell>
                          <TableCell className="font-medium">
                            <Link to={`/product/${item.product_id}`} className="hover:text-[#39536f] hover:underline">
                              {item.title}
                            </Link>
                            {bestSource && (
                              <div className="mt-1 text-sm text-gray-500">
                                Best price from: {bestSource.store}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-center">
                            <div className="relative inline-block">
                              <select 
                                value={item.quantity} 
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                className="appearance-none border rounded py-2 px-4 pr-8 bg-white"
                              >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
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
                            <div className="flex justify-end gap-2">
                              {bestSource && (
                                <a 
                                  href={bestSource.url}
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                                >
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="border-blue-600 text-blue-600"
                                  >
                                    <ExternalLink className="h-4 w-4 mr-1" />
                                    Buy Now
                                  </Button>
                                </a>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
        
          {/* Order Summary - Takes up less space */}
          {items.length > 0 && (
            <div className="lg:col-span-4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4 text-[#39536f]">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${getTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-bold text-[#39536f]">Total</span>
                    <span className="font-bold text-[#39536f]">${getTotal().toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-3 border-[#39536f] text-[#39536f] hover:bg-[#e6eef1]"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
