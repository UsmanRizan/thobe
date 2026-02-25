interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  size?: string;
}

interface FormattedOrder {
  id: string;
  customerName: string;
  email: string;
  address: string;
  phone: string;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  createdAt: string;
}

// Format order data for email template
export function formatOrderForEmail(order: any): FormattedOrder {
  const items =
    typeof order.items === "string" ? JSON.parse(order.items) : order.items;

  return {
    id: order.id,
    customerName: order.customer_name || order.customerName,
    email: order.email,
    address: order.address,
    phone: order.phone,
    items: items,
    totalPrice: order.total_price || order.totalPrice,
    status: order.status,
    createdAt: order.created_at || order.createdAt || new Date().toISOString(),
  };
}

// Generate HTML email content for order confirmation
export function getOrderConfirmationHTML(order: FormattedOrder): string {
  const itemsHTML = order.items
    .map(
      (item) => `
    <tr style="border-bottom: 1px solid #e0e0e0; padding: 12px 0;">
      <td style="padding: 12px; text-align: left;">
        <p style="margin: 0; color: #333; font-weight: 500;">${item.name}</p>
        ${item.size ? `<p style="margin: 4px 0 0 0; color: #666; font-size: 14px;">Size: ${item.size}</p>` : ""}
      </td>
      <td style="padding: 12px; text-align: center; color: #666;">
        ${item.quantity}
      </td>
      <td style="padding: 12px; text-align: right; color: #333; font-weight: 500;">
        $${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `,
    )
    .join("");

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const estimatedDelivery = new Date(
    new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000,
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #333;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 30px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin-bottom: 15px;
      border-bottom: 2px solid #667eea;
      padding-bottom: 10px;
    }
    .order-id {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 15px;
    }
    .order-id-label {
      font-size: 13px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .order-id-value {
      font-size: 18px;
      font-weight: 700;
      color: #667eea;
      margin-top: 5px;
    }
    .product-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .product-table thead {
      background-color: #f8f9fa;
    }
    .product-table th {
      padding: 12px;
      text-align: left;
      font-weight: 600;
      color: #333;
      border-bottom: 2px solid #e0e0e0;
    }
    .product-table td {
      padding: 12px;
    }
    .summary {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      font-size: 16px;
    }
    .summary.total {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 4px;
      font-size: 18px;
      font-weight: 700;
      color: #667eea;
    }
    .info-box {
      background-color: #f0f4ff;
      border-left: 4px solid #667eea;
      padding: 15px;
      margin-bottom: 15px;
      border-radius: 4px;
    }
    .info-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }
    .info-value {
      color: #333;
      font-weight: 500;
    }
    .status-badge {
      display: inline-block;
      background-color: #fff3cd;
      color: #856404;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      border-top: 1px solid #e0e0e0;
      font-size: 13px;
      color: #666;
    }
    .cta-button {
      display: inline-block;
      background-color: #667eea;
      color: white;
      padding: 12px 24px;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 600;
      margin: 15px 0;
      transition: background-color 0.3s ease;
    }
    .cta-button:hover {
      background-color: #764ba2;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>✓ Order Confirmed</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.95;">Thank you for your purchase!</p>
    </div>

    <!-- Content -->
    <div class="content">
      <!-- Order ID -->
      <div class="order-id">
        <div class="order-id-label">Order ID</div>
        <div class="order-id-value">#${order.id}</div>
      </div>

      <!-- Customer Info -->
      <div class="section">
        <div class="section-title">Order Details</div>
        <div class="info-box">
          <div class="info-label">Customer Name</div>
          <div class="info-value">${order.customerName}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Order Date</div>
          <div class="info-value">${orderDate}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Status</div>
          <div style="margin-top: 8px;">
            <span class="status-badge">${order.status}</span>
          </div>
        </div>
      </div>

      <!-- Items -->
      <div class="section">
        <div class="section-title">Items Ordered</div>
        <table class="product-table">
          <thead>
            <tr>
              <th>Product</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>
        <div class="summary total">
          <div style="display: flex; justify-content: space-between;">
            <span>Total:</span>
            <span>$${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <!-- Shipping Info -->
      <div class="section">
        <div class="section-title">Shipping Address</div>
        <div class="info-box">
          <div class="info-label">Address</div>
          <div class="info-value">${order.address}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Phone</div>
          <div class="info-value">${order.phone}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Estimated Delivery</div>
          <div class="info-value">${estimatedDelivery}</div>
        </div>
      </div>

      <!-- Next Steps -->
      <div class="section">
        <div class="section-title">What's Next?</div>
        <p style="color: #666; margin: 0; font-size: 14px;">
          Your order is being processed and will be shipped soon. You can track your order 
          status anytime using your order ID.
        </p>
        <div style="text-align: center;">
          <a href="${process.env.CUSTOMER_PORTAL_URL || "https://yourdomain.com"}/track/${order.id}" class="cta-button">
            Track Your Order
          </a>
        </div>
      </div>

      <!-- Contact Info -->
      <div class="section">
        <p style="color: #666; margin: 0; font-size: 13px; text-align: center;">
          Have questions? Contact us at 
          <a href="mailto:support@thobe-store.com" style="color: #667eea; text-decoration: none;">
            support@thobe-store.com
          </a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p style="margin: 0 0 10px 0;">© 2026 Thobe Store. All rights reserved.</p>
      <p style="margin: 0;">This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
  `;
}
