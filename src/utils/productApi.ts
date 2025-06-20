
import { Product } from "@/types/product";

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

// Platzi API Product interface
interface PlatziProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: {
    id: number;
    name: string;
    image: string;
  };
  images: string[];
}

// Convert FakeStore product to our Product interface
const convertFakeStoreProduct = (fakeProduct: FakeStoreProduct, idOffset: number = 0): Product => ({
  id: fakeProduct.id + idOffset,
  title: fakeProduct.title,
  description: fakeProduct.description,
  price: fakeProduct.price,
  discountPercentage: Math.floor(Math.random() * 30) + 5,
  rating: fakeProduct.rating.rate,
  stock: Math.floor(Math.random() * 50) + 10,
  brand: fakeProduct.category.charAt(0).toUpperCase() + fakeProduct.category.slice(1),
  category: fakeProduct.category,
  thumbnail: fakeProduct.image,
  images: [fakeProduct.image]
});

// Convert Platzi product to our Product interface
const convertPlatziProduct = (platziProduct: PlatziProduct, idOffset: number = 1000): Product => ({
  id: platziProduct.id + idOffset,
  title: platziProduct.title,
  description: platziProduct.description,
  price: platziProduct.price,
  discountPercentage: Math.floor(Math.random() * 25) + 10,
  rating: Math.random() * 2 + 3, // Random rating between 3-5
  stock: Math.floor(Math.random() * 30) + 5,
  brand: platziProduct.category.name,
  category: platziProduct.category.name.toLowerCase(),
  thumbnail: platziProduct.images[0] || '/placeholder.svg',
  images: platziProduct.images
});

export const fetchAllProducts = async (): Promise<Product[]> => {
  try {
    // Fetch from FakeStore API
    const fakeStoreResponse = await fetch("https://fakestoreapi.com/products");
    const fakeStoreProducts: FakeStoreProduct[] = await fakeStoreResponse.json();
    
    // Fetch from Platzi API
    const platziResponse = await fetch("https://api.escuelajs.co/api/v1/products?limit=50");
    const platziProducts: PlatziProduct[] = await platziResponse.json();
    
    // Convert and combine products
    const convertedFakeStore = fakeStoreProducts.map(product => convertFakeStoreProduct(product));
    const convertedPlatzi = platziProducts.map(product => convertPlatziProduct(product));
    
    return [...convertedFakeStore, ...convertedPlatzi];
  } catch (error) {
    console.error("Error fetching products:", error);
    // Fallback to FakeStore only if Platzi fails
    const fakeStoreResponse = await fetch("https://fakestoreapi.com/products");
    const fakeStoreProducts: FakeStoreProduct[] = await fakeStoreResponse.json();
    return fakeStoreProducts.map(product => convertFakeStoreProduct(product));
  }
};

export const getUniqueCategories = (products: Product[]): string[] =>
  Array.from(new Set(products.map((p) => p.category)));

export const filterProducts = (
  products: Product[],
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
