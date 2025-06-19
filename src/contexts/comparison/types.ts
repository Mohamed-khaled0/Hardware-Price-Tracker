
import { Product } from '@/pages/Shop';

export interface ComparisonContextType {
  items: Product[];
  addToComparison: (product: Product) => void;
  removeFromComparison: (productId: number) => void;
  clearComparison: () => void;
  getItemCount: () => number;
  isInComparison: (productId: number) => boolean;
}
