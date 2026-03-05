import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Order } from "../db/models/Order";
import { asyncHandler, ApiError } from "../middleware/errorHandler";
import { validateOrder } from "../middleware/validation";
import { sendOrderConfirmation } from "../services/emailService";
import {
  getOrderConfirmationHTML,
  formatOrderForEmail,
} from "../utils/emailTemplate";

const router = Router();

// Create a new order
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    // Validate request body
    const validation = validateOrder(req.body);
    if (!validation.valid) {
      throw new ApiError(400, "Validation failed", "VALIDATION_ERROR");
    }

    const { customer_name, email, address, phone, items, total_price } =
      req.body;
    const id = uuidv4();

    try {
      const newOrder = await Order.create({
        id,
        customer_name,
        email,
        address,
        phone,
        items,
        total_price,
        status: "pending",
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Format response with camelCase field names
      const orderData = {
        id: newOrder.id,
        customerName: newOrder.customer_name,
        email: newOrder.email,
        address: newOrder.address,
        phone: newOrder.phone,
        items: newOrder.items,
        totalPrice: newOrder.total_price,
        status: newOrder.status,
        createdAt: newOrder.created_at,
        updatedAt: newOrder.updated_at,
      };

      // Send confirmation email asynchronously (don't block the response)
      setImmediate(async () => {
        try {
          // Create email format with snake_case field names
          const emailOrderData = {
            id: newOrder.id,
            customer_name: newOrder.customer_name,
            email: newOrder.email,
            address: newOrder.address,
            phone: newOrder.phone,
            items: newOrder.items, // Mongoose documents are already in the correct format
            total_price: newOrder.total_price,
            status: newOrder.status,
            created_at: newOrder.created_at.toISOString(),
          };
          const formattedOrder = formatOrderForEmail(emailOrderData);
          const htmlContent = getOrderConfirmationHTML(formattedOrder);
          await sendOrderConfirmation(emailOrderData as any, htmlContent);
        } catch (emailError) {
          console.error("Failed to send confirmation email:", emailError);
          // Don't throw error - order was created successfully even if email fails
        }
      });

      res.status(201).json({
        success: true,
        data: orderData,
        message: "Order created successfully",
      });
    } catch (err) {
      throw new ApiError(500, "Failed to create order", "DATABASE_ERROR");
    }
  }),
);

// Get order by ID (with order details)
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const order = await Order.findOne({ id }).lean();

    if (!order) {
      throw new ApiError(404, "Order not found", "ORDER_NOT_FOUND");
    }

    // Format response with camelCase field names
    const orderData = {
      id: order.id,
      customerName: order.customer_name,
      email: order.email,
      address: order.address,
      phone: order.phone,
      items: order.items,
      totalPrice: order.total_price,
      status: order.status,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    };

    res.json({
      success: true,
      data: orderData,
    });
  }),
);

// Track order (returns status and estimated delivery)
router.get(
  "/track/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const order = await Order.findOne({ id }).select("id status created_at");

    if (!order) {
      throw new ApiError(404, "Order not found", "ORDER_NOT_FOUND");
    }

    // Calculate mock tracking status based on order age
    const createdTime = new Date(order.created_at).getTime();
    const now = Date.now();
    const ageHours = (now - createdTime) / (1000 * 60 * 60);

    let trackingStatus = "pending";
    let estimatedDelivery = new Date(createdTime + 7 * 24 * 60 * 60 * 1000); // 7 days

    if (ageHours > 24) {
      trackingStatus = "shipped";
    } else if (ageHours > 72) {
      trackingStatus = "in_delivery";
    } else if (ageHours > 168) {
      trackingStatus = "delivered";
      estimatedDelivery = new Date(createdTime + 7 * 24 * 60 * 60 * 1000);
    }

    res.json({
      success: true,
      data: {
        orderId: id,
        status: trackingStatus,
        createdAt: order.created_at.toISOString(),
        estimatedDelivery: estimatedDelivery.toISOString(),
      },
    });
  }),
);

// Admin: Get all orders (for dashboard)
router.get(
  "/admin/all-orders",
  asyncHandler(async (req: Request, res: Response) => {
    const orders = await Order.find().sort({ created_at: -1 }).lean();

    // Format response with camelCase field names
    const formattedOrders = orders.map((order: any) => ({
      id: order.id,
      customerName: order.customer_name,
      email: order.email,
      address: order.address,
      phone: order.phone,
      items: order.items,
      totalPrice: order.total_price,
      status: order.status,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    }));

    res.json({
      success: true,
      data: formattedOrders,
    });
  }),
);

// Admin: Update order status
router.patch(
  "/admin/orders/:id/status",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["pending", "processing", "shipped", "delivered"];
    if (!validStatuses.includes(status)) {
      throw new ApiError(
        400,
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        "INVALID_STATUS",
      );
    }

    // Check if order exists and update it
    const updatedOrder = await Order.findOneAndUpdate(
      { id },
      { status, updated_at: new Date() },
      { new: true },
    ).lean();

    if (!updatedOrder) {
      throw new ApiError(404, "Order not found", "ORDER_NOT_FOUND");
    }

    // Format response with camelCase field names
    const orderData = {
      id: updatedOrder.id,
      customerName: updatedOrder.customer_name,
      email: updatedOrder.email,
      address: updatedOrder.address,
      phone: updatedOrder.phone,
      items: updatedOrder.items,
      totalPrice: updatedOrder.total_price,
      status: updatedOrder.status,
      createdAt: updatedOrder.created_at,
      updatedAt: updatedOrder.updated_at,
    };

    res.json({
      success: true,
      data: orderData,
      message: `Order status updated to ${status}`,
    });
  }),
);

export default router;
