import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Star, ExternalLink } from "lucide-react";
import { Product } from "./Shop";
import { useCart } from "@/contexts/cart";

const fetchProductById = async (id: string): Promise<Product> => {
  const res = await fetch(`https://dummyjson.com/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product details");
  return res.json();
};

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
  });

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading product details...</div>;
  }

  if (error || !product) {
    return <div className="text-red-600 text-center mt-10">Error: Product not found</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-6 md:py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Breadcrumbs */}
          <div className="text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-[#39536f]">Home</Link> &gt; 
            <Link to="/shop" className="hover:text-[#39536f]"> Shop</Link> &gt; 
            <Link to={`/shop?category=${product.category}`} className="hover:text-[#39536f]"> {product.category}</Link> &gt; 
            <span className="text-[#39536f]"> {product.title}</span>
          </div>

          {/* Product details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product images */}
            <div className="space-y-4">
              <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                <img 
                  src={product.thumbnail} 
                  alt={product.title} 
                  className="w-full h-80 object-contain p-4"
                />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(0, 4).map((img, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:border-[#39536f]">
                    <img 
                      src={img} 
                      alt={`${product.title} ${idx+1}`} 
                      className="w-full h-20 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product info */}
            <div>
              <h1 className="text-3xl font-bold text-[#39536f]">{product.title}</h1>
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  {Array(5).fill(0).map((_, i) => (
                    <Star 
                      key={i} 
                      size={18} 
                      className={`${i < Math.round(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">({product.rating} rating)</span>
              </div>
              
              <div className="mt-6">
                <span className="text-2xl font-bold text-[#39536f]">${product.price.toFixed(2)}</span>
                {product.discountPercentage && (
                  <span className="ml-3 text-lg text-gray-500 line-through">${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}</span>
                )}
                {product.discountPercentage && (
                  <span className="ml-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
                    {Math.round(product.discountPercentage)}% OFF
                  </span>
                )}
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold">Description</h2>
                <p className="mt-2 text-gray-700">{product.description}</p>
              </div>

              <div className="mt-6">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-gray-600">Brand:</span>
                    <span className="ml-2 font-medium">{product.brand}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Category:</span>
                    <span className="ml-2 font-medium capitalize">{product.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">In Stock:</span>
                    <span className={`ml-2 font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `Yes (${product.stock})` : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              <Button 
                className="mt-8 w-full py-6 bg-[#39536f] hover:bg-[#2a405a] text-white text-lg"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                <ShoppingCart className="mr-2" size={20} />
                Add to Cart
              </Button>

              {product.priceComparisons && product.priceComparisons.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-3">Compare Prices</h2>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Store</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Price</th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Visit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {product.priceComparisons.map((comp, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-700">{comp.store}</td>
                            <td className="px-4 py-3 text-sm font-bold text-[#39536f]">${comp.price.toFixed(2)}</td>
                            <td className="px-4 py-3 text-center">
                              <a href={comp.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                                <ExternalLink size={16} className="mr-1" />
                                Visit
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
