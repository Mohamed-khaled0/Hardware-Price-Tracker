
import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWishlist } from "@/contexts/wishlist";

const Cart = () => {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  
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
        <h1 className="text-3xl font-bold mb-2 text-[#39536f]">My Wishlist</h1>
        <p className="text-gray-600 mb-8">You Have {items.length} Items In Your Wishlist</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Wishlist Items - Takes up more space */}
          <div className="lg:col-span-12">
            {items.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Saved Items</h2>
                  <Button 
                    variant="outline" 
                    onClick={clearWishlist}
                    className="border-[#39536f] text-[#39536f] hover:bg-[#e6eef1]"
                  >
                    Clear Wishlist
                  </Button>
                </div>
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="w-[100px]">Image</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="w-[100px] text-right">Price</TableHead>
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
                                onClick={() => removeFromWishlist(item.id)}
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
                <h3 className="text-xl font-medium mb-4">Your wishlist is empty</h3>
                <p className="text-gray-500 mb-6">Save products you're interested in to view them later.</p>
                <Link 
                  to="/shop" 
                  className="inline-block bg-[#39536f] text-white px-6 py-3 rounded-md font-medium hover:bg-[#2a405a]"
                >
                  Browse Products
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
