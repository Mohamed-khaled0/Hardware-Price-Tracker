
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search, Filter, Tag, ChevronDown } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Sample product types
interface PriceComparison {
  store: string;
  price: number;
  url: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  priceComparisons?: PriceComparison[];
}

// Fetch products from the DummyJSON API
const fetchProducts = async (): Promise<{ products: Product[] }> => {
  const response = await fetch('https://dummyjson.com/products');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Simulate price comparisons (this would come from your API)
const addPriceComparisons = (products: Product[]): Product[] => {
  return products.map(product => {
    // Generate 1-3 random price comparisons
    const numComparisons = Math.floor(Math.random() * 3) + 1;
    const stores = ['Amazon', 'eBay', 'Walmart', 'Target', 'Best Buy', 'Newegg'];
    const priceComparisons: PriceComparison[] = [];
    
    for (let i = 0; i < numComparisons; i++) {
      // Get a random store that hasn't been used
      const availableStores = stores.filter(store => 
        !priceComparisons.some(pc => pc.store === store)
      );
      if (availableStores.length === 0) break;
      
      const storeIndex = Math.floor(Math.random() * availableStores.length);
      const store = availableStores[storeIndex];
      
      // Random price variation (+/- 20% of original price)
      const priceFactor = 0.8 + (Math.random() * 0.4); // between 0.8 and 1.2
      const price = Math.round(product.price * priceFactor * 100) / 100;
      
      priceComparisons.push({
        store,
        price,
        url: '#'
      });
    }
    
    // Sort by price
    priceComparisons.sort((a, b) => a.price - b.price);
    
    return {
      ...product,
      priceComparisons
    };
  });
};

// Extract unique categories from products
const getUniqueCategories = (products: Product[]): string[] => {
  const categories = products.map(product => product.category);
  return [...new Set(categories)];
};

// Filter products by category and search term
const filterProducts = (products: Product[], category: string, searchTerm: string): Product[] => {
  return products.filter(product => {
    const matchesCategory = category === 'all' || product.category === category;
    const matchesSearch = searchTerm === '' || 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
};

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  
  // Fetch products using React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    select: (data) => {
      const productsWithComparisons = addPriceComparisons(data.products);
      return productsWithComparisons;
    }
  });
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Extract categories when data is available
    if (data) {
      const uniqueCategories = getUniqueCategories(data);
      setCategories(uniqueCategories);
    }
  }, [data]);
  
  // Filter products based on selected category and search term
  const filteredProducts = data ? filterProducts(data, selectedCategory, searchTerm) : [];
  
  // Calculate the lowest price for a product (either its own price or from comparisons)
  const getLowestPrice = (product: Product): number => {
    if (!product.priceComparisons || product.priceComparisons.length === 0) {
      return product.price;
    }
    
    const lowestComparisonPrice = Math.min(...product.priceComparisons.map(pc => pc.price));
    return Math.min(product.price, lowestComparisonPrice);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-6 md:py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#39536f]">Shop</h1>
          
          {/* Search and filter bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input 
                type="text" 
                placeholder="Search products, brands, categories..." 
                className="pl-10 border-2 border-[#6f7d95] py-6 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2 border-2 border-[#6f7d95] rounded-xl">
                <Filter size={18} />
                <span>Filters</span>
              </Button>
              <Button variant="outline" className="gap-2 border-2 border-[#6f7d95] rounded-xl">
                <Tag size={18} />
                <span>Sort By</span>
                <ChevronDown size={18} />
              </Button>
            </div>
          </div>
          
          {/* Category tabs */}
          <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
            <TabsList className="mb-6 bg-transparent items-start flex-wrap h-auto space-x-2 space-y-2">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-[#39536f] data-[state=active]:text-white rounded-full"
              >
                All Products
              </TabsTrigger>
              
              {categories.map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category} 
                  className="data-[state=active]:bg-[#39536f] data-[state=active]:text-white rounded-full capitalize"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={selectedCategory} className="mt-0">
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#39536f]"></div>
                </div>
              ) : error ? (
                <div className="text-center p-8 text-red-500">
                  Failed to load products. Please try again later.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map(product => (
                    <Card key={product.id} className="overflow-hidden flex flex-col h-full border-2 rounded-xl">
                      <div className="relative aspect-square overflow-hidden">
                        <img 
                          src={product.thumbnail} 
                          alt={product.title} 
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                        {product.discountPercentage && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
                            {Math.round(product.discountPercentage)}% OFF
                          </div>
                        )}
                      </div>
                      
                      <CardHeader className="p-4 pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{product.title}</CardTitle>
                            <CardDescription className="text-sm mt-1">{product.brand}</CardDescription>
                          </div>
                          <div className="flex items-center">
                            <span className="text-yellow-500 mr-1">★</span>
                            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="p-4 flex-grow">
                        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                        
                        {product.priceComparisons && product.priceComparisons.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-600 mb-1">Available at:</p>
                            {product.priceComparisons.map((comparison, index) => (
                              <div key={index} className="flex justify-between items-center mb-1">
                                <span className="text-sm">{comparison.store}</span>
                                <span className="text-sm font-medium">${comparison.price}</span>
                              </div>
                            ))}
                            <Separator className="my-2" />
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">Lowest price:</span>
                              <span className="text-[#39536f] font-bold">${getLowestPrice(product)}</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                      
                      <CardFooter className="p-4 pt-0">
                        <Button className="w-full gap-2 bg-[#39536f] hover:bg-[#2a405a]">
                          <ShoppingCart size={16} />
                          <span>Add to Cart</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
              
              {filteredProducts.length === 0 && !isLoading && (
                <div className="text-center p-8">
                  <p className="text-xl font-medium text-gray-600">No products found</p>
                  <p className="text-gray-500 mt-2">Try changing your search or filter criteria</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Shop;
