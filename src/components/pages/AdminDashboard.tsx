import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { RefreshCw, Download, FileText, X } from "lucide-react";
import { useOrders } from "../../hooks/useOrders";
import { useSummary } from "../../hooks/useSummary";
import { useDownloadOrders } from "../../hooks/useDownloadOrders";
import { SupplyMatrix } from "../AdminDashboard/SupplyMatrix";
import { OrdersTable } from "../AdminDashboard/OrdersTable";

export const AdminDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const {
    orders,
    loading,
    error,
    updatingId,
    fetchOrders,
    updateOrderStatus,
    setError,
  } = useOrders();

  // Filter orders by selected date
  const filteredOrders = useMemo(() => {
    if (!selectedDate) return orders;
    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt).toLocaleDateString("en-CA"); // en-CA format: YYYY-MM-DD
      return orderDate === selectedDate;
    });
  }, [orders, selectedDate]);

  const { summary, widths, lengths, exportCSV } = useSummary(filteredOrders);
  const {
    downloadSingleOrder,
    downloadBulkOrders,
    downloadBulkOrdersDetailed,
    downloadSingleOrderPDF,
    downloadBulkOrdersPDF,
  } = useDownloadOrders();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white py-12 px-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="serif text-4xl mb-2">Admin Dashboard</h1>
              <p className="text-black/60 text-sm">
                Manage orders and update delivery status
              </p>
            </div>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-4 mb-6">
            <label className="text-sm font-semibold text-black/70">
              Filter by Date:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-black/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate("")}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-black/60 hover:text-black bg-black/5 hover:bg-black/10 rounded-lg transition-colors"
                  title="Clear date filter"
                >
                  <X size={14} />
                  Clear
                </button>
              )}
            </div>
            {selectedDate && (
              <span className="text-xs text-black/50">
                Showing {filteredOrders.length} of {orders.length} orders
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={exportCSV}
              disabled={loading || filteredOrders.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-full text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              <Download size={16} />
              Export Summary
            </button>
            <button
              onClick={() => downloadBulkOrders(filteredOrders)}
              disabled={loading || filteredOrders.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Download size={16} />
              Export CSV
            </button>
            <button
              onClick={() => downloadBulkOrdersDetailed(filteredOrders)}
              disabled={loading || filteredOrders.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              <FileText size={16} />
              Export Details
            </button>
            <button
              onClick={() => downloadBulkOrdersPDF(filteredOrders)}
              disabled={loading || filteredOrders.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              <FileText size={16} />
              Export PDF
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
        {!loading && filteredOrders.length > 0 && (
          <SupplyMatrix summary={summary} widths={widths} lengths={lengths} />
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-black/60">Loading orders...</p>
          </div>
        )}

        {/* Orders Table */}
        {!loading && filteredOrders.length > 0 && (
          <OrdersTable
            orders={filteredOrders}
            updatingId={updatingId}
            onStatusChange={updateOrderStatus}
            onDownloadOrder={downloadSingleOrder}
            onDownloadOrderPDF={downloadSingleOrderPDF}
          />
        )}

        {/* Empty State */}
        {!loading && orders.length === 0 && (
          <div className="text-center py-20">
            <p className="text-black/60 text-lg">No orders found</p>
          </div>
        )}

        {/* No Results from Filter */}
        {!loading && orders.length > 0 && filteredOrders.length === 0 && (
          <div className="text-center py-20">
            <p className="text-black/60 text-lg">
              No orders found for{" "}
              {new Date(selectedDate).toLocaleDateString("en-LK")}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
