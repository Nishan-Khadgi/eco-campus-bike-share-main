
import { createContext, useContext, useState, ReactNode } from 'react';
import { type BikeModel } from '@/components/BikeCard';

interface CartContextType {
  cartItems: BikeModel[];
  addToCart: (item: BikeModel) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<BikeModel[]>([]);

  const addToCart = (item: BikeModel) => {
    // Check if item is already in cart
    if (!cartItems.some(cartItem => cartItem.id === item.id)) {
      setCartItems(prev => [...prev, item]);
    }
  };

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
