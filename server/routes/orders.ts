import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../db/database";
import { asyncHandler, ApiError } from "../middleware/errorHandler";
import { validateOrder } from "../middleware/validation";

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
      db.prepare(
        `
        INSERT INTO orders (id, customer_name, email, address, phone, items, total_price, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      ).run(
        id,
        customer_name,
        email,
        address,
        phone,
        JSON.stringify(items),
        total_price,
        "pending",
      );

      const newOrder = db
        .prepare(
          `
        SELECT 
          id,
          customer_name as customerName,
          email,
          address,
          phone,
          items,
          total_price as totalPrice,
          status,
          created_at as createdAt,
          updated_at as updatedAt
        FROM orders
        WHERE id = ?
      `,
        )
        .get(id);

      // Parse items JSON
      if (newOrder && typeof newOrder.items === "string") {
        newOrder.items = JSON.parse(newOrder.items);
      }

      res.status(201).json({
        success: true,
        data: newOrder,
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

    const order = db
      .prepare(
        `
      SELECT 
        id,
        customer_name as customerName,
        email,
        address,
        phone,
        items,
        total_price as totalPrice,
        status,
        created_at as createdAt,
        updated_at as updatedAt
      FROM orders
      WHERE id = ?
    `,
      )
      .get(id);

    if (!order) {
      throw new ApiError(404, "Order not found", "ORDER_NOT_FOUND");
    }

    // Parse items JSON
    if (typeof order.items === "string") {
      order.items = JSON.parse(order.items);
    }

    res.json({
      success: true,
      data: order,
    });
  }),
);

// Track order (returns status and estimated delivery)
router.get(
  "/track/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const order = db
      .prepare(
        `
      SELECT 
        id,
        status,
        created_at as createdAt
      FROM orders
      WHERE id = ?
    `,
      )
      .get(id);

    if (!order) {
      throw new ApiError(404, "Order not found", "ORDER_NOT_FOUND");
    }

    // Calculate mock tracking status based on order age
    const createdTime = new Date(order.createdAt).getTime();
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
        createdAt: order.createdAt,
        estimatedDelivery: estimatedDelivery.toISOString(),
      },
    });
  }),
);

export default router;
