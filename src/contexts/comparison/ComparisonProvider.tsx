
import React, { ReactNode, useState } from 'react';
import { toast } from 'sonner';
import { Product } from '@/pages/Shop';
import { ComparisonContext } from './ComparisonContext';

interface ComparisonProviderProps {
  children: ReactNode;
}

export const ComparisonProvider: React.FC<ComparisonProviderProps> = ({ children }) => {
  const [items, setItems] = useState<Product[]>([]);

  const addToComparison = (product: Product) => {
    if (items.length >= 4) {
      toast.warning('You can only compare up to 4 products at once.');
      return;
    }

    const existingItem = items.find(item => item.id === product.id);
    
    if (existingItem) {
      toast.warning(`${product.title} is already in comparison.`);
      return;
    }

    setItems(prevItems => [...prevItems, product]);
    toast.success(`${product.title} added to comparison!`);
  };

  const removeFromComparison = (productId: number) => {
    const itemToRemove = items.find(item => item.id === productId);
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
    
    if (itemToRemove) {
      toast.success(`${itemToRemove.title} removed from comparison`);
    }
  };

  const clearComparison = () => {
    setItems([]);
    toast.success('Comparison cleared');
  };

  const getItemCount = () => {
    return items.length;
  };

  const isInComparison = (productId: number) => {
    return items.some(item => item.id === productId);
  };

  return (
    <ComparisonContext.Provider value={{
      items,
      addToComparison,
      removeFromComparison,
      clearComparison,
      getItemCount,
      isInComparison
    }}>
      {children}
    </ComparisonContext.Provider>
  );
};
