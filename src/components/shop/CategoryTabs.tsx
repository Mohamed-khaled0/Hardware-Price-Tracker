
import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";

interface CategoryTabsProps {
  selectedCategory: string;
  categories: string[];
  products: Product[];
  filteredProducts: Product[];
  currentSearch: string;
  onCategoryChange: (category: string) => void;
  onClearFilters: () => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  selectedCategory,
  categories,
  products,
  filteredProducts,
  currentSearch,
  onCategoryChange,
  onClearFilters,
}) => {
  return (
    <Tabs value={selectedCategory} onValueChange={onCategoryChange}>
      <TabsList className="mb-6 flex-wrap h-auto">
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
                  onClick={onClearFilters}
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
  );
};

export default CategoryTabs;
