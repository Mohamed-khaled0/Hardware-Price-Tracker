
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';

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
  
  return (
    <Card className="overflow-hidden flex flex-col h-full border-2 rounded-xl">
      <Link to={`/product/${id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <img 
            src={thumbnail} 
            alt={title} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
          {discountPercentage && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
              {Math.round(discountPercentage)}% OFF
            </div>
          )}
        </div>
      </Link>
      
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <Link to={`/product/${id}`}>
              <CardTitle className="text-lg hover:text-[#39536f] hover:underline">{title}</CardTitle>
            </Link>
            <CardDescription className="text-sm mt-1">{brand}</CardDescription>
          </div>
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">★</span>
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 flex-grow">
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        
        {priceComparisons && priceComparisons.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-600 mb-1">Available at:</p>
            {priceComparisons.map((comparison, index) => (
              <div key={index} className="flex justify-between items-center mb-1">
                <span className="text-sm">{comparison.store}</span>
                <span className="text-sm font-medium">${comparison.price}</span>
              </div>
            ))}
            <Separator className="my-2" />
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Lowest price:</span>
              <span className="text-[#39536f] font-bold">${getLowestPrice()}</span>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full gap-2 bg-[#39536f] hover:bg-[#2a405a]"
          onClick={handleAddToCart}
        >
          <ShoppingCart size={16} />
          <span>Add to Cart</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
