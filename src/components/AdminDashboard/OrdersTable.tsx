import React from "react";
import { ChevronDown } from "lucide-react";
import { Order, OrderStatus } from "../../types";

interface OrdersTableProps {
  orders: Order[];
  updatingId: string | null;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

const STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
];

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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  updatingId,
  onStatusChange,
}) => {
  return (
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
                      onStatusChange(order.id, e.target.value as OrderStatus)
                    }
                    disabled={updatingId === order.id}
                    className={`appearance-none px-4 py-2 pr-8 rounded-full border text-xs font-medium cursor-pointer transition-all ${getStatusColor(order.status)} disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none`}
                  >
                    {STATUS_OPTIONS.map((status) => (
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
  );
};
