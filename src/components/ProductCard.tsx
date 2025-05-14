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
    <Card className="overflow-hidden flex flex-col h-full border-2 rounded-xl w-full max-w-[100%] sm:max-w-[280px] mx-auto">
      <Link to={`/product/${id}?provider=${lowestPriceStore?.store || ''}`} className="block w-full">
        <div className="relative w-full h-[140px] sm:h-[220px] md:h-[250px] overflow-hidden">
          <img 
            src={thumbnail} 
            alt={title} 
            width={300}
            height={300}
            loading="lazy"
            className="w-full h-full object-contain p-0.5 sm:p-2 md:p-0 sm:object-cover transition-transform hover:scale-105"
          />
          {discountPercentage && (
            <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md text-xs sm:text-sm font-bold">
              {Math.round(discountPercentage)}% OFF
            </div>
          )}
        </div>
      </Link>
      
      <CardHeader className="p-2 sm:p-4 pb-0">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <Link to={`/product/${id}?provider=${lowestPriceStore?.store || ''}`}>
              <CardTitle className="text-sm sm:text-lg lg:text-xl hover:text-[#39536f] hover:underline line-clamp-2">{title}</CardTitle>
            </Link>
            <CardDescription className="text-xs sm:text-base mt-0.5 sm:mt-1">{brand}</CardDescription>
          </div>
          <div className="flex items-center ml-1 sm:ml-2">
            <span className="text-yellow-500 mr-0.5 sm:mr-1 text-xs sm:text-base">★</span>
            <span className="text-xs sm:text-base font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-2 sm:p-4 flex-grow">
        <p className="text-xs sm:text-base text-gray-600 line-clamp-2">{description}</p>
        
        {priceComparisons && priceComparisons.length > 0 && (
          <div className="mt-1 sm:mt-3">
            <p className="text-xs sm:text-base font-medium text-gray-600 mb-0.5 sm:mb-1">Available at:</p>
            {priceComparisons.map((comparison, index) => (
              <div key={index} className="flex justify-between items-center mb-0.5 sm:mb-1">
                <span className="text-xs sm:text-base">{comparison.store}</span>
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <span className="text-xs sm:text-base font-medium">${comparison.price}</span>
                  <a 
                    href={comparison.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <ExternalLink size={12} className="sm:w-4 sm:h-4" />
                  </a>
                </div>
              </div>
            ))}
            <Separator className="my-1 sm:my-2" />
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-gray-500">Lowest price:</span>
              <span className="text-xs sm:text-base text-[#39536f] font-bold">${getLowestPrice()}</span>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-2 sm:p-4 pt-0">
        <div className="flex flex-col w-full gap-1 sm:gap-2">
          <Button 
            className="w-full gap-1 sm:gap-2 bg-[#39536f] hover:bg-[#2a405a] text-xs sm:text-base py-1.5 sm:py-3"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={14} className="sm:w-5 sm:h-5" />
            <span>Add to Cart</span>
          </Button>
          
          {lowestPriceStore && (
            <Button 
              variant="outline" 
              className="w-full border-[#39536f] text-[#39536f] hover:bg-[#e6eef1] text-xs sm:text-base py-1.5 sm:py-3"
              onClick={() => window.open(lowestPriceStore.url, '_blank')}
            >
              <ExternalLink size={14} className="mr-1 sm:w-5 sm:h-5" />
              {lowestPriceStore.store}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
