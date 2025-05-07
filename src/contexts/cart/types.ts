
import { Product } from '@/pages/Shop';

export interface PriceComparison {
  store: string;
  price: number;
  url: string;
}

export interface CartItem {
  id: string;
  product_id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
  priceComparisons?: PriceComparison[];
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotal: () => number;
  requireAuth: () => boolean;
}
