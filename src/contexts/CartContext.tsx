
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/pages/Shop';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';

export interface CartItem {
  id: string;
  product_id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Load cart items from Supabase or localStorage when user state changes or on component mount
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        try {
          // Load cart from Supabase if user is logged in
          const { data, error } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', user.id);

          if (error) {
            console.error('Error loading cart:', error);
            return;
          }

          if (data) {
            // Transform database cart items to our CartItem interface
            // Need to fetch product details for each item
            const cartItems = await Promise.all(
              data.map(async (item) => {
                // In a real app, you'd fetch product details from your product API/database
                // For now, we'll simulate with minimal information
                return {
                  id: item.id,
                  product_id: item.product_id,
                  title: `Product ${item.product_id}`, // This would be fetched from product database
                  price: 0, // This would be fetched from product database
                  quantity: item.quantity,
                  thumbnail: 'placeholder.svg' // This would be fetched from product database
                };
              })
            );
            setItems(cartItems);
          }
        } catch (error) {
          console.error('Error loading cart from Supabase:', error);
        }
      } else {
        // Load cart from localStorage if user is not logged in
        const savedCart = localStorage.getItem('cart');
        setItems(savedCart ? JSON.parse(savedCart) : []);
      }
    };

    loadCart();
  }, [user]);

  // Save cart to localStorage when it changes (for non-authenticated users)
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, user]);

  const addToCart = async (product: Product) => {
    if (user) {
      // Add item to Supabase if user is logged in
      try {
        const existingItem = items.find(item => item.product_id === product.id);
        
        if (existingItem) {
          toast.warning(`${product.title} is already in your cart.`);
          return;
        }
        
        const { data, error } = await supabase
          .from('cart_items')
          .insert([
            {
              user_id: user.id,
              product_id: product.id,
              quantity: 1
            }
          ])
          .select();

        if (error) {
          toast.error('Failed to add item to cart');
          console.error('Error adding item to cart:', error);
          return;
        }

        if (data && data[0]) {
          const newItem: CartItem = {
            id: data[0].id,
            product_id: product.id,
            title: product.title,
            price: product.price,
            quantity: 1,
            thumbnail: product.thumbnail
          };
          
          setItems(prevItems => [...prevItems, newItem]);
          toast.success(`${product.title} added to cart!`);
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error('Failed to add item to cart');
      }
    } else {
      // Handle local cart for non-authenticated users
      setItems(prevItems => {
        const existingItem = prevItems.find(item => item.product_id === product.id);
        
        if (existingItem) {
          toast.warning(`${product.title} is already in your cart.`);
          return prevItems;
        } else {
          toast.success(`${product.title} added to cart!`);
          return [...prevItems, {
            id: uuidv4(),
            product_id: product.id,
            title: product.title,
            price: product.price,
            quantity: 1,
            thumbnail: product.thumbnail
          }];
        }
      });
    }
  };

  const removeFromCart = async (id: string) => {
    if (user) {
      // Remove item from Supabase if user is logged in
      try {
        const itemToRemove = items.find(item => item.id === id);
        
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', id);

        if (error) {
          toast.error('Failed to remove item from cart');
          console.error('Error removing item from cart:', error);
          return;
        }

        setItems(prevItems => prevItems.filter(item => item.id !== id));
        
        if (itemToRemove) {
          toast.success(`${itemToRemove.title} removed from cart`);
        }
      } catch (error) {
        console.error('Error removing from cart:', error);
        toast.error('Failed to remove item from cart');
      }
    } else {
      // Handle local cart for non-authenticated users
      setItems(prevItems => {
        const itemToRemove = prevItems.find(item => item.id === id);
        if (itemToRemove) {
          toast.success(`${itemToRemove.title} removed from cart`);
        }
        return prevItems.filter(item => item.id !== id);
      });
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    if (user) {
      // Update item quantity in Supabase if user is logged in
      try {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', id);

        if (error) {
          toast.error('Failed to update item quantity');
          console.error('Error updating item quantity:', error);
          return;
        }

        setItems(prevItems =>
          prevItems.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        );
      } catch (error) {
        console.error('Error updating quantity:', error);
        toast.error('Failed to update item quantity');
      }
    } else {
      // Handle local cart for non-authenticated users
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (user) {
      // Clear all items from Supabase if user is logged in
      try {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);

        if (error) {
          toast.error('Failed to clear cart');
          console.error('Error clearing cart:', error);
          return;
        }

        setItems([]);
        toast.success('Cart cleared');
      } catch (error) {
        console.error('Error clearing cart:', error);
        toast.error('Failed to clear cart');
      }
    } else {
      // Handle local cart for non-authenticated users
      setItems([]);
      toast.success('Cart cleared');
    }
  };

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getItemCount,
      getTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
