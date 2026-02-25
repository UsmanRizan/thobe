import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, X } from "lucide-react";
import { CartItem } from "../../types";
import { CartItemComponent } from "./CartItemComponent";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totalPrice: number;
  onUpdateQuantity: (id: string, delta: number) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  totalPrice,
  onUpdateQuantity,
  onCheckout,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="p-8 flex items-center justify-between border-b border-black/5">
              <h3 className="serif text-2xl">Your Bag</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-8 space-y-8">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center">
                    <ShoppingBag size={24} className="text-black/20" />
                  </div>
                  <p className="text-black/40 font-light">
                    Your bag is currently empty.
                  </p>
                  <button
                    onClick={onClose}
                    className="text-sm uppercase tracking-widest font-bold underline"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <CartItemComponent
                    key={item.id}
                    item={item}
                    onUpdateQuantity={onUpdateQuantity}
                  />
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-8 border-t border-black/5 space-y-6 bg-gray-50/50">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-black/40">Subtotal</span>
                    <span>LKR {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-black/40">Shipping</span>
                    <span className="text-emerald-600">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-medium pt-4 border-t border-black/5">
                    <span>Total</span>
                    <span>LKR {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
                <button
                  onClick={onCheckout}
                  className="w-full h-14 bg-black text-white rounded-full text-sm uppercase tracking-widest font-bold hover:bg-black/90 transition-all active:scale-[0.98]"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
