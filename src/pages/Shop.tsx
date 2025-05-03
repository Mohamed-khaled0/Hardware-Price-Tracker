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
  // add random priceComparisons
  return json.products.map((product) => {
    const stores = ["Amazon", "eBay", "Walmart", "Target", "Best Buy"];
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
                <span>Sort By</span>
                <ChevronDown size={18} />
              </Button>
            </div>
          </div>

          {/* Category Tabs */}
          <Tabs
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="mb-8"
          >
            <TabsList className="mb-6 bg-transparent flex-wrap space-x-2 space-y-2">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-[#39536f] data-[state=active]:text-white rounded-full"
              >
                All Products
              </TabsTrigger>
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="data-[state=active]:bg-[#39536f] data-[state=active]:text-white rounded-full capitalize"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Content */}
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#39536f]" />
            </div>
          ) : error ? (
            <div className="text-center p-8 text-red-500">
              Failed to load products. Please try again later.
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden flex flex-col h-full border-2 rounded-xl"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.thumbnail}
                      loading="lazy"
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
                        <CardTitle className="text-lg">
                          {product.title}
                        </CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {product.brand}
                        </CardDescription>
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="text-sm font-medium">
                          {product.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 flex-grow">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </p>

                    {product.priceComparisons?.length ? (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Available at:
                        </p>
                        {product.priceComparisons.map((comp) => (
                          <div
                            key={comp.store}
                            className="flex justify-between items-center mb-1"
                          >
                            <span className="text-sm">{comp.store}</span>
                            <span className="text-sm font-medium">
                              ${comp.price}
                            </span>
                          </div>
                        ))}
                        <Separator className="my-2" />
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            Lowest price:
                          </span>
                          <span className="text-[#39536f] font-bold">
                            ${getLowestPrice(product)}
                          </span>
                        </div>
                      </div>
                    ) : null}
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
          ) : (
            <div className="text-center p-8">
              <p className="text-xl font-medium text-gray-600">
                No products found
              </p>
              <p className="text-gray-500 mt-2">
                Try changing your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
