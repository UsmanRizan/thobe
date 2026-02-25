import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { apiClient } from "../../api/client";

export const OrderTracking = () => {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState<{
    orderId: string;
    status: string;
    estimatedDelivery: string;
    createdAt: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;

    setLoading(true);
    setError(null);
    setStatus(null);

    try {
      const trackingData = await apiClient.trackOrder(orderId);
      setStatus(trackingData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to track order");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "pending":
        return "bg-amber-500";
      case "shipped":
        return "bg-blue-500";
      case "in_delivery":
        return "bg-blue-600";
      case "delivered":
        return "bg-emerald-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "pending":
        return "Processing";
      case "shipped":
        return "Shipped";
      case "in_delivery":
        return "In Delivery";
      case "delivered":
        return "Delivered";
      default:
        return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto py-24 px-6 space-y-12"
    >
      <h2 className="serif text-5xl text-center">Track Your Order</h2>
      <div className="max-w-md mx-auto space-y-8">
        <p className="text-center text-black/60 font-light">
          Enter your order ID to check the current status of your premium thobe.
        </p>
        <form onSubmit={handleTrack} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">
              Order ID
            </label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. ORD-12345"
              className="w-full bg-gray-50 border-none rounded-xl px-4 py-4 text-sm focus:ring-1 focus:ring-black outline-none"
            />
          </div>
          <button
            disabled={loading}
            className="w-full h-14 bg-black text-white rounded-full text-sm uppercase tracking-widest font-bold disabled:opacity-50"
          >
            {loading ? "Tracking..." : "Track Order"}
          </button>
        </form>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 p-4 rounded-2xl border border-red-200 text-red-700 text-sm"
            >
              {error}
            </motion.div>
          )}
          {status && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-50 p-8 rounded-3xl border border-black/5 text-center space-y-6"
            >
              <div>
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-black/40 mb-4">
                  Current Status
                </h3>
                <div className="flex items-center justify-center gap-4">
                  <div
                    className={`w-3 h-3 rounded-full ${getStatusColor(status.status)}`}
                  />
                  <span className="text-2xl font-medium">
                    {getStatusLabel(status.status)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-black/60">
                <p className="font-light">
                  {status.status === "pending" &&
                    "Your order is being carefully prepared at our atelier."}
                  {status.status === "shipped" &&
                    "Your order is on its way to your doorstep."}
                  {status.status === "in_delivery" &&
                    "Your order is out for delivery today."}
                  {status.status === "delivered" &&
                    "Your order has been successfully delivered."}
                </p>
                <p className="text-[12px]">
                  Estimated Delivery:{" "}
                  {new Date(status.estimatedDelivery).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
