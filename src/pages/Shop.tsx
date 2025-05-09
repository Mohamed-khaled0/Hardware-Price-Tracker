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
import { Filter, Search, Tag } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

// --- Types ---
interface PriceComparison {
  store: string;
  price: number;
  url: string;
}

export interface Product {
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

// --- Helpers ---
const fetchProducts = async (): Promise<Product[]> => {
  const res = await fetch("https://dummyjson.com/products");
  if (!res.ok) throw new Error("Failed to fetch products");
  const json = (await res.json()) as { products: Product[] };

  const stores = ["Amazon", "eBay", "Walmart", "Target", "Best Buy"];
  return json.products.map((product) => {
    const comps: PriceComparison[] = [];
    const count = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < count; i++) {
      const store = stores[i % stores.length];
      const factor = 0.8 + Math.random() * 0.4;
      comps.push({
        store,
        price: Math.round(product.price * factor * 100) / 100,
        url: "#",
      });
    }
    comps.sort((a, b) => a.price - b.price);
    return { ...product, priceComparisons: comps };
  });
};

const getUniqueCategories = (products: Product[]): string[] =>
  Array.from(new Set(products.map((p) => p.category)));

const filterProducts = (
  products: Product[],
  category: string,
  term: string
): Product[] =>
  products.filter((p) => {
    const inCat = category === "all" || p.category === category;
    const t = term.toLowerCase();
    const inText =
      (p.title?.toLowerCase() || '').includes(t) ||
      (p.brand?.toLowerCase() || '').includes(t) ||
      (p.description?.toLowerCase() || '').includes(t);
    return inCat && (term === "" || inText);
  });

// --- Component ---
const Shop: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get("search") || "");
  const [categories, setCategories] = useState<string[]>([]);

  const {
    data: products,
    isLoading,
    error,
  } = useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  useEffect(() => {
    if (products) {
      setCategories(getUniqueCategories(products));
    }
  }, [products]);

  useEffect(() => {
    const search = searchParams.get("search");
    if (search) {
      setSearchTerm(search);
    }
  }, [searchParams]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading products...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center mt-10">Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products, brands, categories..."
                className="pl-10 border-2 border-[#6f7d95] py-3 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
          </div>

          <Separator className="my-4" />

          {/* Category Tabs */}
          <Tabs defaultValue={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              {categories.map((cat) => (
                <TabsTrigger key={cat} value={cat}>
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>

            {['all', ...categories].map((cat) => (
              <TabsContent key={cat} value={cat}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filterProducts(products!, cat, searchTerm).map((p) => (
                    <ProductCard 
                      key={p.id}
                      id={p.id}
                      title={p.title}
                      description={p.description}
                      price={p.price}
                      discountPercentage={p.discountPercentage}
                      rating={p.rating}
                      brand={p.brand}
                      thumbnail={p.thumbnail}
                      priceComparisons={p.priceComparisons}
                    />
                  ))}
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
