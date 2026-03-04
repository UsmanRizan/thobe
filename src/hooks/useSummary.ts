import { useMemo } from "react";
import { Order, Width, Length } from "../types";

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

export const useSummary = (orders: Order[]) => {
  const summary = useMemo(() => {
    const matrix: Record<string, Record<string, number>> = {};

    LENGTHS.forEach((length) => {
      matrix[length] = {};
      WIDTHS.forEach((width) => {
        matrix[length][width] = 0;
      });
    });

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
  }, [orders]);

  const exportCSV = () => {
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

  return {
    summary,
    widths: WIDTHS,
    lengths: LENGTHS,
    exportCSV,
  };
};
