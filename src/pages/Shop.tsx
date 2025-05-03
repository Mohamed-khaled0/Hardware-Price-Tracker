import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search, Filter, Tag, ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// --- Types ---
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

const getUniqueCategories = (products: Product[]) =>
  Array.from(new Set(products.map((p) => p.category)));

const filterProducts = (
  products: Product[],
  category: string,
  term: string
) =>
  products.filter((p) => {
    const inCat = category === "all" || p.category === category;
    const t = term.toLowerCase();
    const inText =
      p.title.toLowerCase().includes(t) ||
      p.brand.toLowerCase().includes(t) ||
      p.description.toLowerCase().includes(t);
    return inCat && (term === "" || inText);
  });

const getLowestPrice = (p: Product) => {
  if (!p.priceComparisons || !p.priceComparisons.length) return p.price;
  return Math.min(p.price, ...p.priceComparisons.map((c) => c.price));
};

// --- Component ---
const Shop: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
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
    window.scrollTo(0, 0);
    if (products) {
      setCategories(getUniqueCategories(products));
    }
  }, [products]);

  const filtered = products
    ? filterProducts(products, selectedCategory, searchTerm)
    : [];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-6 md:py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#39536f]">
            Shop
          </h1>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
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
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="gap-2 border-2 border-[#6f7d95] rounded-xl"
              >
                <Filter size={18} />
                <span>Filters</span>
              </Button>
              <Button
                variant="outline"
                className="gap-2 border-2 border-[#6f7d95] rounded-xl"
              >
                <Tag size={18} />
                <span>Deals</span>
              </Button>
            </div>
          </div>
          {/* Add remaining UI here... */}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
