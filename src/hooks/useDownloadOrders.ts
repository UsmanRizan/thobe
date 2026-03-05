import jsPDF from "jspdf";
import { Order } from "../types";

export const useDownloadOrders = () => {
  const formatOrderAsText = (order: Order): string => {
    const date = new Date(order.createdAt).toLocaleDateString("en-LK", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const itemsText = Array.isArray(order.items)
      ? order.items
          .map(
            (item, idx) =>
              `${idx + 1}. ${item.name} - Size: ${item.width}x${item.length} - Qty: ${item.quantity} - Price: Rs. ${item.price.toLocaleString()}`,
          )
          .join("\n")
      : "No items";

    return `
ORDER DETAILS
${"=".repeat(60)}

ORDER ID: ${order.id}
DATE: ${date}
STATUS: ${order.status.toUpperCase()}

CUSTOMER INFORMATION
${"-".repeat(60)}
Name: ${order.customerName}
Email: ${order.email}
Phone: ${order.phone}

DELIVERY ADDRESS
${"-".repeat(60)}
${order.address}

ITEMS ORDERED
${"-".repeat(60)}
${itemsText}

TOTAL ORDER VALUE: Rs. ${order.totalPrice.toLocaleString()}

${"=".repeat(60)}
Generated on: ${new Date().toLocaleDateString("en-LK")}
    `.trim();
  };

  const downloadSingleOrder = (order: Order) => {
    const content = formatOrderAsText(order);
    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `order-${order.id.slice(0, 8)}.txt`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadBulkOrders = (orders: Order[]) => {
    let csvContent =
      "Order ID,Customer Name,Email,Phone,Delivery Address,Items,Item Details,Order Value (LKR),Status,Date\n";

    orders.forEach((order) => {
      const date = new Date(order.createdAt).toLocaleDateString("en-LK");
      const itemCount = Array.isArray(order.items) ? order.items.length : 0;
      const itemDetails = Array.isArray(order.items)
        ? order.items
            .map(
              (item) =>
                `${item.name} (${item.width}x${item.length}) x${item.quantity}`,
            )
            .join("; ")
        : "";

      // Escape commas and quotes in fields
      const address = order.address.replace(/"/g, '""');
      const itemDetailsEscaped = itemDetails.replace(/"/g, '""');
      const customerName = order.customerName.replace(/"/g, '""');

      const row = [
        order.id,
        `"${customerName}"`,
        order.email,
        order.phone,
        `"${address}"`,
        itemCount,
        `"${itemDetailsEscaped}"`,
        order.totalPrice,
        order.status,
        date,
      ].join(",");

      csvContent += row + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `orders-bulk-${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadBulkOrdersDetailed = (orders: Order[]) => {
    const textContent = orders
      .map((order) => formatOrderAsText(order))
      .join("\n\n" + "=".repeat(60) + "\n\n");

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `orders-detailed-${new Date().toISOString().split("T")[0]}.txt`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSingleOrderPDF = (order: Order) => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const date = new Date(order.createdAt).toLocaleDateString("en-LK", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let yPosition = 20;
    const pageHeight = pdf.internal.pageSize.height;
    const margin = 15;
    const maxWidth = 180;

    // Title
    pdf.setFontSize(18);
    pdf.setFont(undefined, "bold");
    pdf.text("ORDER DETAILS", margin, yPosition);
    yPosition += 15;

    // Order ID and Date
    pdf.setFontSize(10);
    pdf.setFont(undefined, "normal");
    pdf.text(`Order ID: ${order.id}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Date: ${date}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Status: ${order.status.toUpperCase()}`, margin, yPosition);
    yPosition += 12;

    // Customer Information Section
    pdf.setFont(undefined, "bold");
    pdf.text("CUSTOMER INFORMATION", margin, yPosition);
    yPosition += 6;
    pdf.setFont(undefined, "normal");
    pdf.text(`Name: ${order.customerName}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Email: ${order.email}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Phone: ${order.phone}`, margin, yPosition);
    yPosition += 12;

    // Delivery Address Section
    pdf.setFont(undefined, "bold");
    pdf.text("DELIVERY ADDRESS", margin, yPosition);
    yPosition += 6;
    pdf.setFont(undefined, "normal");
    const addressLines = pdf.splitTextToSize(order.address, maxWidth);
    pdf.text(addressLines, margin, yPosition);
    yPosition += addressLines.length * 5 + 6;

    // Items Section
    pdf.setFont(undefined, "bold");
    pdf.text("ITEMS ORDERED", margin, yPosition);
    yPosition += 8;

    if (Array.isArray(order.items) && order.items.length > 0) {
      pdf.setFont(undefined, "normal");
      order.items.forEach((item, idx) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(`${idx + 1}. ${item.name}`, margin, yPosition);
        yPosition += 5;
        pdf.text(
          `   Size: ${item.width}x${item.length} | Quantity: ${item.quantity} | Price: Rs. ${(item.price * item.quantity).toLocaleString()}`,
          margin,
          yPosition,
        );
        yPosition += 7;
      });
    }

    if (yPosition > pageHeight - 30) {
      pdf.addPage();
      yPosition = 20;
    }

    yPosition += 6;

    // Total Order Value
    pdf.setFont(undefined, "bold");
    pdf.setFontSize(12);
    pdf.text(
      `TOTAL ORDER VALUE: Rs. ${order.totalPrice.toLocaleString()}`,
      margin,
      yPosition,
    );

    pdf.save(`order-${order.id.slice(0, 8)}.pdf`);
  };

  const downloadBulkOrdersPDF = (orders: Order[]) => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    let yPosition = 20;
    const pageHeight = pdf.internal.pageSize.height;
    const margin = 15;
    const maxWidth = 180;

    // Title
    pdf.setFontSize(16);
    pdf.setFont(undefined, "bold");
    pdf.text("ALL ORDERS SUMMARY", margin, yPosition);
    yPosition += 12;

    pdf.setFontSize(10);
    const generatedDate = new Date().toLocaleDateString("en-LK", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    pdf.setFont(undefined, "normal");
    pdf.text(`Generated: ${generatedDate}`, margin, yPosition);
    pdf.text(`Total Orders: ${orders.length}`, 120, yPosition);
    yPosition += 12;

    // Orders list
    orders.forEach((order, orderIdx) => {
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = 20;
      }

      const date = new Date(order.createdAt).toLocaleDateString("en-LK");

      // Order header
      pdf.setFont(undefined, "bold");
      pdf.setFontSize(11);
      pdf.text(
        `Order #${orderIdx + 1}: ${order.id.slice(0, 8)} - ${order.customerName}`,
        margin,
        yPosition,
      );
      yPosition += 6;

      // Order details
      pdf.setFont(undefined, "normal");
      pdf.setFontSize(9);
      pdf.text(`Date: ${date} | Phone: ${order.phone}`, margin, yPosition);
      yPosition += 5;

      // Address
      const addressLines = pdf.splitTextToSize(
        `Address: ${order.address}`,
        maxWidth,
      );
      pdf.text(addressLines, margin, yPosition);
      yPosition += addressLines.length * 4 + 2;

      // Items count and value
      const itemCount = Array.isArray(order.items) ? order.items.length : 0;
      pdf.text(
        `Items: ${itemCount} | Value: Rs. ${order.totalPrice.toLocaleString()} | Status: ${order.status.toUpperCase()}`,
        margin,
        yPosition,
      );
      yPosition += 10;
    });

    pdf.save(`orders-bulk-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return {
    downloadSingleOrder,
    downloadBulkOrders,
    downloadBulkOrdersDetailed,
    downloadSingleOrderPDF,
    downloadBulkOrdersPDF,
  };
};
