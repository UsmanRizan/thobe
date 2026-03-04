import React from "react";
import { motion } from "motion/react";
import { RefreshCw, Download } from "lucide-react";
import { useOrders } from "../../hooks/useOrders";
import { useSummary } from "../../hooks/useSummary";
import { SupplyMatrix } from "../AdminDashboard/SupplyMatrix";
import { OrdersTable } from "../AdminDashboard/OrdersTable";

export const AdminDashboard = () => {
  const {
    orders,
    loading,
    error,
    updatingId,
    fetchOrders,
    updateOrderStatus,
    setError,
  } = useOrders();
  const { summary, widths, lengths, exportCSV } = useSummary(orders);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white py-12 px-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="serif text-4xl mb-2">Admin Dashboard</h1>
            <p className="text-black/60 text-sm">
              Manage orders and update delivery status
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportCSV}
              disabled={loading || orders.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-full text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              <Download size={16} />
              Export Summary
            </button>
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full text-sm font-semibold hover:bg-black/90 disabled:opacity-50 transition-colors"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Supply Summary */}
        {!loading && orders.length > 0 && (
          <SupplyMatrix summary={summary} widths={widths} lengths={lengths} />
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-black/60">Loading orders...</p>
          </div>
        )}

        {/* Orders Table */}
        {!loading && orders.length > 0 && (
          <OrdersTable
            orders={orders}
            updatingId={updatingId}
            onStatusChange={updateOrderStatus}
          />
        )}

        {/* Empty State */}
        {!loading && orders.length === 0 && (
          <div className="text-center py-20">
            <p className="text-black/60 text-lg">No orders found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
