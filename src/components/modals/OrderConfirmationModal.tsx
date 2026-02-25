import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import { CartItem } from "../../types";

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lastOrder: {
    id?: string;
    items: CartItem[];
    total: number;
  } | null;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  isOpen,
  onClose,
  lastOrder,
}) => {
  return (
    <AnimatePresence>
      {isOpen && lastOrder && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden p-12 text-center"
          >
            <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-200">
              <Check size={40} strokeWidth={3} />
            </div>
            <h3 className="serif text-4xl mb-4">Order Confirmed</h3>
            <p className="text-black/40 font-light mb-10">
              Thank you for choosing Al-Abyad. Your premium thobe is being
              prepared for delivery.
            </p>

            <div className="bg-gray-50 rounded-3xl p-8 mb-10 text-left space-y-4">
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-black/40 border-b border-black/5 pb-4">
                Order Details
              </h4>
              {lastOrder?.id && (
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-black/60">Order ID:</p>
                  <p className="font-mono text-sm font-bold text-black">
                    {lastOrder.id}
                  </p>
                </div>
              )}
              {lastOrder?.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-black/60">
                    {item.quantity}x {item.name} (W:{item.width} L:
                    {item.length})
                  </span>
                  <span className="font-medium">
                    LKR {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="pt-4 border-t border-black/5 flex justify-between font-bold text-lg">
                <span>Total Paid</span>
                <span>LKR {lastOrder?.total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full h-16 bg-black text-white rounded-full text-sm uppercase tracking-widest font-bold hover:bg-black/90 transition-all active:scale-[0.98]"
            >
              Continue Shopping
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
