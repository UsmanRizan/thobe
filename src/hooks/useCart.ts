import { useState } from "react";
import { CartItem, Width, Length } from "../types";
import { PRODUCT_NAME, PRODUCT_PRICE } from "../constants/product";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const addToCart = (width: Width, length: Length) => {
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 1000);

    setCart((prev) => {
      const existing = prev.find(
        (item) => item.width === width && item.length === length,
      );
      if (existing) {
        return prev.map((item) =>
          item.width === width && item.length === length
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          name: PRODUCT_NAME,
          price: PRODUCT_PRICE,
          width,
          length,
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = Math.max(0, item.quantity + delta);
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return {
    cart,
    setCart,
    addToCart,
    updateQuantity,
    clearCart,
    isAdding,
    totalItems,
    totalPrice,
  };
};
