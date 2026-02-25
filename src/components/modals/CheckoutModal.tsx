import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check } from "lucide-react";
import { CartItem } from "../../types";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  totalPrice: number;
  checkoutData: {
    customerName: string;
    email: string;
    address: string;
    phone: string;
  };
  setCheckoutData: (data: any) => void;
  isLoading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  totalPrice,
  checkoutData,
  setCheckoutData,
  isLoading,
  error,
  onSubmit,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="grid md:grid-cols-2">
              <div className="p-10 space-y-8">
                <div className="space-y-2">
                  <h3 className="serif text-3xl">Checkout</h3>
                  <p className="text-sm text-black/40">
                    Complete your order details.
                  </p>
                </div>
                <form className="space-y-4" onSubmit={onSubmit}>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      value={checkoutData.customerName}
                      onChange={(e) =>
                        setCheckoutData({
                          ...checkoutData,
                          customerName: e.target.value,
                        })
                      }
                      className="w-full bg-black/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      value={checkoutData.email}
                      onChange={(e) =>
                        setCheckoutData({
                          ...checkoutData,
                          email: e.target.value,
                        })
                      }
                      className="w-full bg-black/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">
                      Shipping Address
                    </label>
                    <textarea
                      required
                      value={checkoutData.address}
                      onChange={(e) =>
                        setCheckoutData({
                          ...checkoutData,
                          address: e.target.value,
                        })
                      }
                      className="w-full bg-black/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black outline-none h-24"
                      placeholder="123 Galle Road, Colombo 03"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">
                      Phone Number
                    </label>
                    <input
                      required
                      type="tel"
                      value={checkoutData.phone}
                      onChange={(e) =>
                        setCheckoutData({
                          ...checkoutData,
                          phone: e.target.value,
                        })
                      }
                      className="w-full bg-black/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black outline-none"
                      placeholder="+94 77 123 4567"
                    />
                  </div>
                  {error && (
                    <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg border border-red-200">
                      {error}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 bg-black text-white rounded-full text-sm uppercase tracking-widest font-bold mt-4 disabled:opacity-50"
                  >
                    {isLoading ? "Processing..." : "Place Order"}
                  </button>
                </form>
              </div>
              <div className="bg-gray-50 p-10 space-y-8">
                <h4 className="text-xs uppercase tracking-widest font-bold">
                  Order Summary
                </h4>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-black/60">
                        {item.quantity}x {item.name} (W:{item.width} L:
                        {item.length})
                      </span>
                      <span>
                        LKR {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-black/5 flex justify-between font-bold">
                    <span>Total</span>
                    <span>LKR {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl flex items-start gap-3">
                  <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={12} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-900">
                      Cash on Delivery
                    </p>
                    <p className="text-[10px] text-emerald-700 mt-1">
                      Pay when your premium thobe arrives at your doorstep.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
