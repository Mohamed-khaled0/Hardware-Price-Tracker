
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/shop/SearchBar";
import CategoryTabs from "@/components/shop/CategoryTabs";
import { useSearch } from "@/contexts/search";
import { fetchAllProducts, getUniqueCategories, filterProducts } from "@/utils/productApi";

const Shop: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { currentSearch, setCurrentSearch, searchHistory, addToHistory, clearHistory } = useSearch();
  const [categories, setCategories] = useState<string[]>([]);

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
    const category = searchParams.get("category");
    
    if (search) {
      setCurrentSearch(search);
      addToHistory(search);
    }
    
    if (category) {
      setSelectedCategory(category);
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

  const handleHistorySelect = (search: string) => {
    setCurrentSearch(search);
    addToHistory(search);
  };

  const handleClearFilters = () => {
    setCurrentSearch('');
    setSelectedCategory('all');
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
  const categoryFromUrl = searchParams.get("category");
  const showCategoryMessage = categoryFromUrl && filteredProducts.length === 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Shop All Products</h1>
            <p className="text-gray-600">Discover amazing products from multiple sources at the best prices</p>
            {showCategoryMessage && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">
                  We don't have products for "{categoryFromUrl}" category right now, but we're working on adding more items soon! 
                  Browse all our available products below.
                </p>
              </div>
            )}
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <SearchBar
              currentSearch={currentSearch}
              searchHistory={searchHistory}
              onSearchChange={handleSearch}
              onSearchSubmit={handleSearchSubmit}
              onHistorySelect={handleHistorySelect}
              onClearHistory={clearHistory}
            />
          </div>

          <Separator className="my-4" />

          {/* Category Tabs */}
          <CategoryTabs
            selectedCategory={selectedCategory}
            categories={categories}
            products={products || []}
            filteredProducts={filteredProducts}
            currentSearch={currentSearch}
            onCategoryChange={setSelectedCategory}
            onClearFilters={handleClearFilters}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
