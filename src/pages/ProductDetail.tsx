
import React from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heart, Star, ExternalLink, GitCompare } from "lucide-react";
import { Product } from "./Shop";
import { useWishlist } from "@/contexts/wishlist";
import { useComparison } from "@/contexts/comparison";
import PriceHistoryChart from "@/components/PriceHistoryChart";
import ProductReviews from "@/components/ProductReviews";

const fetchProductById = async (id: string): Promise<Product> => {
  const res = await fetch(`https://dummyjson.com/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product details");
  const product = await res.json();
  
  // Add mock price comparisons
  product.priceComparisons = [
    {
      store: "Amazon",
      price: product.price * 0.95,
      url: "https://amazon.com"
    },
    {
      store: "Best Buy",
      price: product.price * 1.05,
      url: "https://bestbuy.com"
    },
    {
      store: "Newegg",
      price: product.price * 0.98,
      url: "https://newegg.com"
    }
  ];
  
  return product;
};

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const selectedProvider = searchParams.get('provider');
  const { addToWishlist, isInWishlist } = useWishlist();
  const { addToComparison, isInComparison } = useComparison();
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
  });

  const handleAddToWishlist = () => {
    if (product) {
      addToWishlist(product);
    }
  };

  const handleAddToComparison = () => {
    if (product) {
      addToComparison(product);
    }
  };

  // Find the source with the lowest price or the selected provider
  const getLowestPriceSource = () => {
    if (!product?.priceComparisons || product.priceComparisons.length === 0) {
      return null;
    }
    
    if (selectedProvider) {
      return product.priceComparisons.find(pc => pc.store === selectedProvider) || 
             product.priceComparisons.reduce(
               (lowest, current) => current.price < lowest.price ? current : lowest,
               product.priceComparisons[0]
             );
    }
    
    return product.priceComparisons.reduce(
      (lowest, current) => current.price < lowest.price ? current : lowest,
      product.priceComparisons[0]
    );
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading product details...</div>;
  }

  if (error || !product) {
    return <div className="text-red-600 text-center mt-10">Error: Product not found</div>;
  }

  const lowestPriceSource = getLowestPriceSource();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-4 sm:py-6 md:py-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8">
          {/* Breadcrumbs */}
          <div className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
            <Link to="/" className="hover:text-[#39536f]">Home</Link> &gt; 
            <Link to="/shop" className="hover:text-[#39536f]"> Shop</Link> &gt; 
            <Link to={`/shop?category=${product.category}`} className="hover:text-[#39536f]"> {product.category}</Link> &gt; 
            <span className="text-[#39536f]"> {product.title}</span>
          </div>

          {/* Product details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            {/* Product images */}
            <div className="space-y-3 sm:space-y-4">
              <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                <img 
                  src={product.thumbnail} 
                  alt={product.title} 
                  className="w-full h-36 sm:h-48 md:h-64 lg:h-80 object-contain p-4 sm:p-4 md:p-4"
                />
              </div>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {product.images.slice(0, 4).map((img, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:border-[#39536f]">
                    <img 
                      src={img} 
                      alt={`${product.title} ${idx+1}`} 
                      className="w-full h-12 sm:h-16 md:h-20 object-contain p-2 sm:p-1 md:p-0 sm:object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product info */}
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#39536f]">{product.title}</h1>
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  {Array(5).fill(0).map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={`${i < Math.round(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                    />
                  ))}
                </div>
                <span className="ml-2 text-xs sm:text-sm text-gray-600">({product.rating} rating)</span>
              </div>
              
              <div className="mt-4 sm:mt-6">
                <span className="text-xl sm:text-2xl font-bold text-[#39536f]">${product.price.toFixed(2)}</span>
                {product.discountPercentage && (
                  <span className="ml-2 sm:ml-3 text-base sm:text-lg text-gray-500 line-through">${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}</span>
                )}
                {product.discountPercentage && (
                  <span className="ml-2 sm:ml-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs sm:text-sm font-bold">
                    {Math.round(product.discountPercentage)}% OFF
                  </span>
                )}
              </div>

              <div className="mt-4 sm:mt-6">
                <h2 className="text-base sm:text-lg font-semibold">Description</h2>
                <p className="mt-2 text-sm sm:text-base text-gray-700">{product.description}</p>
              </div>

              <div className="mt-4 sm:mt-6">
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div>
                    <span className="text-xs sm:text-sm text-gray-600">Brand:</span>
                    <span className="ml-2 text-xs sm:text-sm font-medium">{product.brand}</span>
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm text-gray-600">Category:</span>
                    <span className="ml-2 text-xs sm:text-sm font-medium capitalize">{product.category}</span>
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm text-gray-600">In Stock:</span>
                    <span className={`ml-2 text-xs sm:text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `Yes (${product.stock})` : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 flex flex-col gap-2 sm:gap-3">
                <div className="flex gap-2">
                  <Button 
                    className={`flex-1 gap-2 text-xs sm:text-base py-1.5 sm:py-3 ${
                      isInWishlist(product.id) 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-[#39536f] hover:bg-[#2a405a]'
                    }`}
                    onClick={handleAddToWishlist}
                  >
                    <Heart size={14} className={`sm:w-5 sm:h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                    <span>{isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className={`gap-2 text-xs sm:text-base py-1.5 sm:py-3 ${
                      isInComparison(product.id) 
                        ? 'border-green-500 text-green-600 bg-green-50' 
                        : 'border-[#39536f] text-[#39536f] hover:bg-[#e6eef1]'
                    }`}
                    onClick={handleAddToComparison}
                  >
                    <GitCompare size={14} className="sm:w-5 sm:h-5" />
                    <span>{isInComparison(product.id) ? 'Added' : 'Compare'}</span>
                  </Button>
                </div>
                
                {lowestPriceSource && (
                  <Button 
                    variant="outline" 
                    className="w-full border-[#39536f] text-[#39536f] hover:bg-[#e6eef1] text-xs sm:text-base py-1.5 sm:py-3"
                    onClick={() => window.open(lowestPriceSource.url, '_blank')}
                  >
                    <ExternalLink size={14} className="mr-1 sm:w-5 sm:h-5" />
                    Buy at {lowestPriceSource.store}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Price History Chart */}
          <PriceHistoryChart 
            productId={product.id}
            currentPrice={product.price}
          />

          {/* Product Reviews */}
          <ProductReviews productId={product.id} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
