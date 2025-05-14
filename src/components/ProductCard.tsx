import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ExternalLink } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/cart';

interface PriceComparison {
  store: string;
  price: number;
  url: string;
}

interface ProductCardProps {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating: number;
  brand: string;
  thumbnail: string;
  priceComparisons?: PriceComparison[];
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
  priceComparisons,
}) => {
  const { addToCart } = useCart();
  
  // Find the lowest price among all sources
  const getLowestPrice = (): number => {
    if (!priceComparisons || priceComparisons.length === 0) {
      return price;
    }
    
    const lowestComparisonPrice = Math.min(...priceComparisons.map(pc => pc.price));
    return Math.min(price, lowestComparisonPrice);
  };

  // Find the store with the lowest price
  const getLowestPriceStore = (): PriceComparison | null => {
    if (!priceComparisons || priceComparisons.length === 0) {
      return null;
    }
    
    return priceComparisons.reduce((lowest, current) => 
      current.price < lowest.price ? current : lowest, 
      priceComparisons[0]
    );
  };

  const handleAddToCart = () => {
    addToCart({ 
      id, 
      title, 
      description, 
      price: getLowestPrice(), 
      discountPercentage, 
      rating, 
      brand, 
      thumbnail, 
      priceComparisons,
      stock: 10, // Default value, not used in cart display
      category: '', // Default value, not used in cart display
      images: [thumbnail] // Default value, not used in cart display
    });
  };

  const lowestPriceStore = getLowestPriceStore();
  
  return (
    <Card className="overflow-hidden flex flex-col h-full border-2 rounded-xl max-w-[280px] sm:max-w-none mx-auto">
      <Link to={`/product/${id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <img 
            src={thumbnail} 
            alt={title} 
            width={300}
            height={300}
            loading="lazy"
            className="w-full h-full object-contain p-2 sm:p-0 sm:object-cover transition-transform hover:scale-105"
          />
          {discountPercentage && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs sm:text-sm font-bold">
              {Math.round(discountPercentage)}% OFF
            </div>
          )}
        </div>
      </Link>
      
      <CardHeader className="p-3 sm:p-4 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <Link to={`/product/${id}`}>
              <CardTitle className="text-base sm:text-lg hover:text-[#39536f] hover:underline">{title}</CardTitle>
            </Link>
            <CardDescription className="text-xs sm:text-sm mt-1">{brand}</CardDescription>
          </div>
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">★</span>
            <span className="text-xs sm:text-sm font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-3 sm:p-4 flex-grow">
        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{description}</p>
        
        {priceComparisons && priceComparisons.length > 0 && (
          <div className="mt-2 sm:mt-3">
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Available at:</p>
            {priceComparisons.map((comparison, index) => (
              <div key={index} className="flex justify-between items-center mb-1">
                <span className="text-xs sm:text-sm">{comparison.store}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs sm:text-sm font-medium">${comparison.price}</span>
                  <a 
                    href={comparison.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <ExternalLink size={12} className="sm:w-3.5 sm:h-3.5" />
                  </a>
                </div>
              </div>
            ))}
            <Separator className="my-2" />
            <div className="flex justify-between items-center">
              <span className="text-[10px] sm:text-xs text-gray-500">Lowest price:</span>
              <span className="text-[#39536f] text-sm sm:text-base font-bold">${getLowestPrice()}</span>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-3 sm:p-4 pt-0">
        <div className="flex w-full gap-2">
          <Button 
            className="flex-1 gap-1 sm:gap-2 bg-[#39536f] hover:bg-[#2a405a] text-xs sm:text-sm py-2 sm:py-3"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
            <span>Add to Cart</span>
          </Button>
          
          {lowestPriceStore && (
            <Button 
              variant="outline" 
              className="border-[#39536f] text-[#39536f] hover:bg-[#e6eef1] text-xs sm:text-sm py-2 sm:py-3"
              onClick={() => window.open(lowestPriceStore.url, '_blank')}
            >
              <ExternalLink size={14} className="mr-1 sm:w-4 sm:h-4" />
              {lowestPriceStore.store}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
