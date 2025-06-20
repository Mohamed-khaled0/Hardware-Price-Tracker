
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

const fetchFeaturedProducts = async (): Promise<FakeStoreProduct[]> => {
  const res = await fetch('https://fakestoreapi.com/products');
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

const FeaturedProducts = () => {
  const { data: products, isLoading, error } = useQuery<FakeStoreProduct[], Error>({
    queryKey: ['featuredProducts'],
    queryFn: fetchFeaturedProducts,
  });

  if (isLoading) {
    return (
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Featured Products</h2>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#39536f]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Featured Products</h2>
          <div className="text-center text-red-600">Failed to load products</div>
        </div>
      </div>
    );
  }

  // Filter for electronics (includes phones and cameras-like products)
  const electronicsProducts = products?.filter(product => 
    product.category === 'electronics'
  ).slice(0, 6) || [];

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Featured Electronics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {electronicsProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-full object-contain p-4"
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-2">{product.title}</CardTitle>
                <CardDescription className="line-clamp-2">{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-[#39536f]">${product.price}</span>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="text-sm">{product.rating.rate} ({product.rating.count})</span>
                  </div>
                </div>
                <Link to="/shop">
                  <Button className="w-full bg-[#39536f] hover:bg-[#2a405a]">
                    Compare Prices
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/shop">
            <Button variant="outline" className="border-[#39536f] text-[#39536f] hover:bg-[#39536f] hover:text-white">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
