
import React, { ReactNode, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Product } from '@/types/product';
import { CartContext } from './CartContext';
import { CartItem } from './types';

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load cart items from Supabase when user state changes or on component mount
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
            const cartItems = await Promise.all(
              data.map(async (item) => {
                try {
                  const productRes = await fetch(`https://dummyjson.com/products/${item.product_id}`);
                  const product = await productRes.json();
                  
                  return {
                    id: item.id,
                    product_id: item.product_id,
                    title: product.title,
                    price: product.price,
                    quantity: item.quantity,
                    thumbnail: product.thumbnail
                  };
                } catch {
                  return {
                    id: item.id,
                    product_id: item.product_id,
                    title: `Product ${item.product_id}`,
                    price: 0,
                    quantity: item.quantity,
                    thumbnail: 'placeholder.svg'
                  };
                }
              })
            );
            setItems(cartItems);
          }
        } catch (error) {
          console.error('Error loading cart from Supabase:', error);
        }
      } else {
        setItems([]);
      }
    };

    loadCart();
  }, [user]);

  // Check if user is authenticated
  const requireAuth = () => {
    if (!user) {
      toast.error('Please sign in to use the cart', {
        action: {
          label: 'Sign In',
          onClick: () => navigate('/login')
        }
      });
      return false;
    }
    return true;
  };

  const addToCart = async (product: Product) => {
    // Check if user is authenticated
    if (!requireAuth()) return;
    
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
            user_id: user!.id,
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
  };

  const removeFromCart = async (id: string) => {
    // Check if user is authenticated
    if (!requireAuth()) return;
    
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
  };

  const updateQuantity = async (id: string, quantity: number) => {
    // Check if user is authenticated
    if (!requireAuth()) return;
    
    if (quantity < 1) return;
    
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
  };

  const clearCart = async () => {
    // Check if user is authenticated
    if (!requireAuth()) return;
    
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user!.id);

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
      getTotal,
      requireAuth
    }}>
      {children}
    </CartContext.Provider>
  );
};
