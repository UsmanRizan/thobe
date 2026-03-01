import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { RefreshCw, ChevronDown, Download } from "lucide-react";
import { Order, OrderStatus, Width, Length } from "../../types";

const API_BASE_URL = "http://localhost:3001/api/orders";
const WIDTHS: Width[] = ["S", "M", "L", "XL", "XXL"];
const LENGTHS: Length[] = [
  "53",
  "54",
  "55",
  "56",
  "57",
  "58",
  "59",
  "60",
  "61",
  "62",
];

export const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/all-orders`);
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: OrderStatus,
  ) => {
    setUpdatingId(orderId);
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      const data = await response.json();
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? data.data : order)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const statusOptions: OrderStatus[] = [
    "pending",
    "processing",
    "shipped",
    "delivered",
  ];

  const generateOrderSummary = () => {
    // Initialize matrix: length -> width -> quantity
    const matrix: Record<string, Record<string, number>> = {};

    LENGTHS.forEach((length) => {
      matrix[length] = {};
      WIDTHS.forEach((width) => {
        matrix[length][width] = 0;
      });
    });

    // Count items by size pair (width x length)
    orders.forEach((order) => {
      if (Array.isArray(order.items)) {
        order.items.forEach((item) => {
          if (
            LENGTHS.includes(item.length as Length) &&
            WIDTHS.includes(item.width as Width)
          ) {
            matrix[item.length][item.width] += item.quantity;
          }
        });
      }
    });

    return matrix;
  };

  const exportOrderSummary = () => {
    const summary = generateOrderSummary();

    // Create CSV with lengths as rows, widths as columns
    const csvRows: string[] = [];

    // Header row with widths
    csvRows.push(["Length", ...WIDTHS].join(","));

    // Data rows with lengths
    LENGTHS.forEach((length) => {
      const row = [
        length,
        ...WIDTHS.map((width) => summary[length][width].toString()),
      ];
      csvRows.push(row.join(","));
    });

    // Add totals row
    const totals = WIDTHS.map((width) => {
      return LENGTHS.reduce((sum, length) => sum + summary[length][width], 0);
    });
    csvRows.push(["Total", ...totals.map((t) => t.toString())].join(","));

    const csvContent = csvRows.join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `order-summary-${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
              onClick={exportOrderSummary}
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

        {/* Order Summary Section */}
        {!loading && orders.length > 0 && (
          <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-black">
              Supply Summary (Size Matrix)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-emerald-300 bg-emerald-100 p-2 font-semibold text-black text-sm">
                      Length
                    </th>
                    {WIDTHS.map((width) => (
                      <th
                        key={width}
                        className="border border-emerald-300 bg-emerald-100 p-2 font-semibold text-black text-sm w-16"
                      >
                        {width}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LENGTHS.map((length) => {
                    const summary = generateOrderSummary();
                    const rowTotal = WIDTHS.reduce(
                      (sum, width) => sum + summary[length][width],
                      0,
                    );
                    return (
                      <tr key={length}>
                        <td className="border border-gray-300 bg-white p-2 font-semibold text-black text-sm">
                          {length}
                        </td>
                        {WIDTHS.map((width) => {
                          const count = summary[length][width];
                          return (
                            <td
                              key={`${length}-${width}`}
                              className={`border border-gray-300 p-2 text-center font-bold text-sm ${
                                count > 0
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-white text-gray-400"
                              }`}
                            >
                              {count > 0 ? count : "—"}
                            </td>
                          );
                        })}
                        <td className="border border-gray-300 bg-blue-50 p-2 text-center font-bold text-sm text-blue-700">
                          {rowTotal > 0 ? rowTotal : "—"}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-black/5">
                    <td className="border border-emerald-300 bg-black font-bold text-white p-2 text-sm">
                      Total
                    </td>
                    {WIDTHS.map((width) => {
                      const summary = generateOrderSummary();
                      const colTotal = LENGTHS.reduce(
                        (sum, length) => sum + summary[length][width],
                        0,
                      );
                      return (
                        <td
                          key={`total-${width}`}
                          className="border border-emerald-300 bg-black text-center font-bold text-white p-2 text-sm"
                        >
                          {colTotal}
                        </td>
                      );
                    })}
                    <td className="border border-emerald-300 bg-black text-center font-bold text-white p-2 text-sm">
                      {LENGTHS.reduce((sum, length) => {
                        const summary = generateOrderSummary();
                        return (
                          sum +
                          WIDTHS.reduce(
                            (widthSum, width) =>
                              widthSum + summary[length][width],
                            0,
                          )
                        );
                      }, 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-black/60">Loading orders...</p>
          </div>
        )}

        {/* Orders Table */}
        {!loading && orders.length > 0 && (
          <div className="overflow-x-auto border border-black/10 rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-black/10">
                  <th className="px-6 py-4 text-left font-semibold text-black/80">
                    Customer Name
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-black/80">
                    Shipping Address
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-black/80">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-right font-semibold text-black/80">
                    Order Value
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-black/80">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-black/80">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-black/5 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-black">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 text-black/70 text-sm">
                      {order.address}
                    </td>
                    <td className="px-6 py-4 text-black/70 font-mono text-sm">
                      {order.phone}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-black">
                      {new Intl.NumberFormat("en-LK", {
                        style: "currency",
                        currency: "LKR",
                      }).format(order.totalPrice)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative inline-flex">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusUpdate(
                              order.id,
                              e.target.value as OrderStatus,
                            )
                          }
                          disabled={updatingId === order.id}
                          className={`appearance-none px-4 py-2 pr-8 rounded-full border text-xs font-medium cursor-pointer transition-all ${getStatusColor(order.status)} disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none`}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={14}
                          className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-black/60 text-xs">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
