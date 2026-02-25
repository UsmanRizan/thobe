import { useState } from "react";
import { CartItem } from "../types";
import { apiClient } from "../api/client";

export const useCheckout = () => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [lastOrder, setLastOrder] = useState<{
    id?: string;
    items: CartItem[];
    total: number;
  } | null>(null);
  const [checkoutData, setCheckoutData] = useState({
    customerName: "",
    email: "",
    address: "",
    phone: "",
  });

  const handleCheckout = async (
    e: React.FormEvent,
    cart: CartItem[],
    totalPrice: number,
    onSuccess: () => void,
  ) => {
    e.preventDefault();

    if (
      !checkoutData.customerName ||
      !checkoutData.email ||
      !checkoutData.address ||
      !checkoutData.phone
    ) {
      setCheckoutError("Please fill in all fields");
      return;
    }

    setCheckoutError(null);
    setIsCheckoutLoading(true);

    try {
      const createdOrder = await apiClient.createOrder({
        customer_name: checkoutData.customerName,
        email: checkoutData.email,
        address: checkoutData.address,
        phone: checkoutData.phone,
        items: cart,
        total_price: totalPrice,
      });

      setLastOrder({
        id: createdOrder.id,
        items: [...cart],
        total: totalPrice,
      });
      setIsCheckoutOpen(false);
      setIsOrderConfirmed(true);
      setCheckoutData({
        customerName: "",
        email: "",
        address: "",
        phone: "",
      });
      onSuccess();
    } catch (err) {
      setCheckoutError(
        err instanceof Error
          ? err.message
          : "Failed to create order. Please try again.",
      );
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  return {
    isCheckoutOpen,
    setIsCheckoutOpen,
    isOrderConfirmed,
    setIsOrderConfirmed,
    isCheckoutLoading,
    checkoutError,
    setCheckoutError,
    lastOrder,
    checkoutData,
    setCheckoutData,
    handleCheckout,
  };
};
