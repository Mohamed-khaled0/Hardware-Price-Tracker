
import { Product } from '@/pages/Shop';

export interface WishlistItem {
  id: string;
  product_id: number;
  title: string;
  price: number;
  thumbnail: string;
}

export interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
  getItemCount: () => number;
  isInWishlist: (productId: number) => boolean;
}
