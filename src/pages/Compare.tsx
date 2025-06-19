
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X, Star } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useComparison } from '@/contexts/comparison';

const Compare = () => {
  const { items, removeFromComparison, clearComparison } = useComparison();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-[#39536f]">Product Comparison</h1>
            <p className="text-gray-600 mb-8">No products to compare yet.</p>
            <Link 
              to="/shop" 
              className="inline-block bg-[#39536f] text-white px-6 py-3 rounded-md font-medium hover:bg-[#2a405a]"
            >
              Browse Products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const compareFeatures = [
    { key: 'title', label: 'Product Name' },
    { key: 'price', label: 'Price' },
    { key: 'rating', label: 'Rating' },
    { key: 'brand', label: 'Brand' },
    { key: 'category', label: 'Category' },
    { key: 'stock', label: 'Stock' },
    { key: 'discountPercentage', label: 'Discount' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#39536f]">Compare Products</h1>
          <Button 
            variant="outline" 
            onClick={clearComparison}
            className="border-[#39536f] text-[#39536f] hover:bg-[#e6eef1]"
          >
            Clear All
          </Button>
        </div>

        {/* Product Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {items.map((product) => (
            <Card key={product.id} className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10"
                onClick={() => removeFromComparison(product.id)}
              >
                <X className="h-4 w-4" />
              </Button>
              <CardHeader className="pb-2">
                <div className="aspect-square overflow-hidden rounded-lg">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Link to={`/product/${product.id}`}>
                  <CardTitle className="text-sm hover:text-[#39536f] hover:underline line-clamp-2">
                    {product.title}
                  </CardTitle>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-48">Feature</TableHead>
                  {items.map((product) => (
                    <TableHead key={product.id} className="text-center">
                      Product {product.id}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {compareFeatures.map((feature) => (
                  <TableRow key={feature.key}>
                    <TableCell className="font-medium">{feature.label}</TableCell>
                    {items.map((product) => (
                      <TableCell key={product.id} className="text-center">
                        {feature.key === 'price' ? (
                          <span className="font-bold text-[#39536f]">
                            ${product[feature.key as keyof typeof product]?.toFixed(2)}
                          </span>
                        ) : feature.key === 'rating' ? (
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span>{product[feature.key as keyof typeof product]}</span>
                          </div>
                        ) : feature.key === 'discountPercentage' ? (
                          product[feature.key as keyof typeof product] ? (
                            <span className="text-red-600 font-medium">
                              {Math.round(product[feature.key as keyof typeof product] as number)}% OFF
                            </span>
                          ) : (
                            'No discount'
                          )
                        ) : feature.key === 'stock' ? (
                          <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                          </span>
                        ) : (
                          String(product[feature.key as keyof typeof product] || 'N/A')
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Compare;
