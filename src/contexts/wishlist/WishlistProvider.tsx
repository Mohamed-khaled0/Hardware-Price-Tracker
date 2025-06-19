
import React, { ReactNode, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { Product } from '@/pages/Shop';
import { WishlistContext } from './WishlistContext';
import { WishlistItem } from './types';

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const { user } = useAuth();
  const [sessionId] = useState(() => 
    localStorage.getItem('session_id') || 
    (() => {
      const id = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('session_id', id);
      return id;
    })()
  );

  useEffect(() => {
    loadWishlist();
  }, [user]);

  const loadWishlist = async () => {
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('*')
        .or(
          user 
            ? `user_id.eq.${user.id}` 
            : `session_id.eq.${sessionId}`
        );

      if (error) {
        console.error('Error loading wishlist:', error);
        return;
      }

      if (data) {
        const wishlistItems = await Promise.all(
          data.map(async (item) => {
            try {
              const productRes = await fetch(`https://dummyjson.com/products/${item.product_id}`);
              const product = await productRes.json();
              
              return {
                id: item.id,
                product_id: item.product_id,
                title: product.title,
                price: product.price,
                thumbnail: product.thumbnail,
                priceComparisons: product.priceComparisons
              };
            } catch {
              return {
                id: item.id,
                product_id: item.product_id,
                title: `Product ${item.product_id}`,
                price: 0,
                thumbnail: 'placeholder.svg'
              };
            }
          })
        );
        setItems(wishlistItems);
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  };

  const addToWishlist = async (product: Product) => {
    try {
      const existingItem = items.find(item => item.product_id === product.id);
      
      if (existingItem) {
        toast.warning(`${product.title} is already in your wishlist.`);
        return;
      }
      
      const { data, error } = await supabase
        .from('wishlist_items')
        .insert([
          {
            user_id: user?.id || null,
            session_id: user ? null : sessionId,
            product_id: product.id
          }
        ])
        .select();

      if (error) {
        toast.error('Failed to add item to wishlist');
        console.error('Error adding item to wishlist:', error);
        return;
      }

      if (data && data[0]) {
        const newItem: WishlistItem = {
          id: data[0].id,
          product_id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          priceComparisons: product.priceComparisons
        };
        
        setItems(prevItems => [...prevItems, newItem]);
        toast.success(`${product.title} added to wishlist!`);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add item to wishlist');
    }
  };

  const removeFromWishlist = async (id: string) => {
    try {
      const itemToRemove = items.find(item => item.id === id);
      
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error('Failed to remove item from wishlist');
        console.error('Error removing item from wishlist:', error);
        return;
      }

      setItems(prevItems => prevItems.filter(item => item.id !== id));
      
      if (itemToRemove) {
        toast.success(`${itemToRemove.title} removed from wishlist`);
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item from wishlist');
    }
  };

  const clearWishlist = async () => {
    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .or(
          user 
            ? `user_id.eq.${user.id}` 
            : `session_id.eq.${sessionId}`
        );

      if (error) {
        toast.error('Failed to clear wishlist');
        console.error('Error clearing wishlist:', error);
        return;
      }

      setItems([]);
      toast.success('Wishlist cleared');
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist');
    }
  };

  const getItemCount = () => {
    return items.length;
  };

  const isInWishlist = (productId: number) => {
    return items.some(item => item.product_id === productId);
  };

  return (
    <WishlistContext.Provider value={{
      items,
      addToWishlist,
      removeFromWishlist,
      clearWishlist,
      getItemCount,
      isInWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
