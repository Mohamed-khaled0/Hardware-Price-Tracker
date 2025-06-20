
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, History, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useSearch } from "@/contexts/search";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// FakeStore API Product interface
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

// Convert FakeStore product to our Product interface
const convertToProduct = (fakeProduct: FakeStoreProduct) => ({
  id: fakeProduct.id,
  title: fakeProduct.title,
  description: fakeProduct.description,
  price: fakeProduct.price,
  discountPercentage: Math.floor(Math.random() * 30) + 5, // Random discount for demo
  rating: fakeProduct.rating.rate,
  stock: Math.floor(Math.random() * 50) + 10, // Random stock for demo
  brand: fakeProduct.category.charAt(0).toUpperCase() + fakeProduct.category.slice(1),
  category: fakeProduct.category,
  thumbnail: fakeProduct.image,
  images: [fakeProduct.image]
});

const fetchAllProducts = async () => {
  const res = await fetch("https://fakestoreapi.com/products");
  if (!res.ok) throw new Error("Failed to fetch products");
  const fakeProducts: FakeStoreProduct[] = await res.json();
  return fakeProducts.map(convertToProduct);
};

const getUniqueCategories = (products: any[]): string[] =>
  Array.from(new Set(products.map((p) => p.category)));

const filterProducts = (
  products: any[],
  category: string,
  term: string
) =>
  products.filter((p) => {
    const inCat = category === "all" || p.category === category;
    const t = term.toLowerCase();
    const inText =
      (p.title?.toLowerCase() || '').includes(t) ||
      (p.brand?.toLowerCase() || '').includes(t) ||
      (p.description?.toLowerCase() || '').includes(t);
    return inCat && (term === "" || inText);
  });

const Shop: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { currentSearch, setCurrentSearch, searchHistory, addToHistory, clearHistory } = useSearch();
  const [categories, setCategories] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["allProducts"],
    queryFn: fetchAllProducts,
  });

  useEffect(() => {
    if (products) {
      setCategories(getUniqueCategories(products));
    }
  }, [products]);

  useEffect(() => {
    const search = searchParams.get("search");
    if (search) {
      setCurrentSearch(search);
      addToHistory(search);
    }
  }, [searchParams, setCurrentSearch, addToHistory]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSearch(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSearch.trim()) {
      addToHistory(currentSearch.trim());
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#39536f]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="text-red-600 text-center mt-10">Error: {error.message}</div>
        <Footer />
      </div>
    );
  }

  const filteredProducts = filterProducts(products || [], selectedCategory, currentSearch);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Shop All Products</h1>
            <p className="text-gray-600">Discover amazing products at the best prices</p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products, brands..."
                className="pl-10 border-2 border-[#6f7d95] py-3 rounded-xl"
                value={currentSearch}
                onChange={handleSearch}
              />
              {searchHistory.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      <History className="h-5 w-5 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <div className="flex items-center justify-between px-2 py-1.5">
                      <span className="text-sm font-medium">Recent Searches</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearHistory();
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Separator />
                    {searchHistory.map((search, index) => (
                      <DropdownMenuItem
                        key={index}
                        onClick={() => {
                          setCurrentSearch(search);
                          addToHistory(search);
                        }}
                      >
                        {search}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </form>
          </div>

          <Separator className="my-4" />

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Products ({products?.length || 0})</TabsTrigger>
              {categories.map((cat) => (
                <TabsTrigger key={cat} value={cat} className="capitalize">
                  {cat.replace(/'/g, '')} ({products?.filter(p => p.category === cat).length || 0})
                </TabsTrigger>
              ))}
            </TabsList>

            {['all', ...categories].map((cat) => (
              <TabsContent key={cat} value={cat}>
                <div className="mt-6 sm:mt-8">
                  <div className="mb-4">
                    <p className="text-gray-600">
                      Showing {filteredProducts.length} products
                      {cat !== 'all' && ` in ${cat.replace(/'/g, '')}`}
                      {currentSearch && ` matching "${currentSearch}"`}
                    </p>
                  </div>
                  
                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">No products found matching your criteria</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => {
                          setCurrentSearch('');
                          setSelectedCategory('all');
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                      {filteredProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          id={product.id}
                          title={product.title}
                          description={product.description}
                          price={product.price}
                          discountPercentage={product.discountPercentage}
                          rating={product.rating}
                          brand={product.brand}
                          thumbnail={product.thumbnail}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
