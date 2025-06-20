
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, GitCompare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '@/contexts/wishlist';
import { useComparison } from '@/contexts/comparison';
import { useCart } from '@/contexts/cart';

interface ProductCardProps {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating: number;
  brand: string;
  thumbnail: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  description,
  price,
  discountPercentage,
  rating,
  brand,
  thumbnail,
}) => {
  const { addToWishlist, isInWishlist } = useWishlist();
  const { addToComparison, isInComparison } = useComparison();
  const { addToCart } = useCart();

  const handleAddToWishlist = () => {
    addToWishlist({ 
      id, 
      title, 
      description, 
      price, 
      discountPercentage, 
      rating, 
      brand, 
      thumbnail, 
      stock: 10,
      category: '',
      images: [thumbnail]
    });
  };

  const handleAddToComparison = () => {
    addToComparison({ 
      id, 
      title, 
      description, 
      price, 
      discountPercentage, 
      rating, 
      brand, 
      thumbnail, 
      stock: 10,
      category: '',
      images: [thumbnail]
    });
  };

  const handleAddToCart = () => {
    addToCart({ 
      id, 
      title, 
      description, 
      price, 
      discountPercentage, 
      rating, 
      brand, 
      thumbnail, 
      stock: 10,
      category: '',
      images: [thumbnail]
    });
  };

  // Handle image error by using a placeholder
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop';
  };
  
  return (
    <Card className="overflow-hidden flex flex-col h-full border-2 rounded-xl w-full max-w-[100%] sm:max-w-[280px] mx-auto">
      <Link to={`/product/${id}`} className="block w-full">
        <div className="relative w-full h-[180px] sm:h-[220px] md:h-[250px] overflow-hidden bg-gray-50">
          <img 
            src={thumbnail} 
            alt={title} 
            loading="lazy"
            onError={handleImageError}
            className="w-full h-full object-contain hover:object-cover transition-all duration-300 hover:scale-105 p-2"
            style={{
              objectPosition: 'center',
              maxWidth: '100%',
              maxHeight: '100%'
            }}
          />
          {discountPercentage && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold z-10">
              {Math.round(discountPercentage)}% OFF
            </div>
          )}
        </div>
      </Link>
      
      <CardHeader className="p-2 sm:p-4 pb-0">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <Link to={`/product/${id}`}>
              <CardTitle className="text-sm sm:text-lg lg:text-xl hover:text-[#39536f] hover:underline line-clamp-2 leading-tight">{title}</CardTitle>
            </Link>
            <CardDescription className="text-xs sm:text-base mt-0.5 sm:mt-1">{brand}</CardDescription>
          </div>
          <div className="flex items-center ml-1 sm:ml-2 flex-shrink-0">
            <span className="text-yellow-500 mr-0.5 sm:mr-1 text-xs sm:text-base">★</span>
            <span className="text-xs sm:text-base font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-2 sm:p-4 flex-grow">
        <p className="text-xs sm:text-base text-gray-600 line-clamp-2 mb-2">{description}</p>
        
        <div className="mt-2 sm:mt-4">
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl font-bold text-[#39536f]">${price.toFixed(2)}</span>
            {discountPercentage && (
              <span className="text-sm sm:text-base text-gray-500 line-through">
                ${(price / (1 - discountPercentage / 100)).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-2 sm:p-4 pt-0">
        <div className="flex flex-col w-full gap-1 sm:gap-2">
          <div className="flex gap-1 sm:gap-2">
            <Button 
              className="flex-1 gap-1 sm:gap-2 text-xs sm:text-base py-1.5 sm:py-3 bg-[#39536f] hover:bg-[#2a405a]"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={14} className="sm:w-5 sm:h-5" />
              <span>Add to Cart</span>
            </Button>
            
            <Button 
              className={`gap-1 sm:gap-2 text-xs sm:text-base py-1.5 sm:py-3 ${
                isInWishlist(id) 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-gray-500 hover:bg-gray-600'
              }`}
              onClick={handleAddToWishlist}
            >
              <Heart size={14} className={`sm:w-5 sm:h-5 ${isInWishlist(id) ? 'fill-current' : ''}`} />
            </Button>
          </div>
          
          <Button 
            variant="outline"
            className={`gap-1 sm:gap-2 text-xs sm:text-base py-1.5 sm:py-3 w-full ${
              isInComparison(id) 
                ? 'border-green-500 text-green-600 bg-green-50' 
                : 'border-[#39536f] text-[#39536f] hover:bg-[#e6eef1]'
            }`}
            onClick={handleAddToComparison}
          >
            <GitCompare size={14} className="sm:w-5 sm:h-5" />
            <span>{isInComparison(id) ? 'Added to Compare' : 'Compare'}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
