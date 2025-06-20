
import { Product } from '@/types/product';

export interface CartItem {
  id: string;
  product_id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
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
