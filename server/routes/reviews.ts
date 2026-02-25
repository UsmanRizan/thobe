import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../db/database";
import { asyncHandler, ApiError } from "../middleware/errorHandler";
import { validateReview } from "../middleware/validation";

const router = Router();

// Get all reviews
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const reviews = db
      .prepare(
        `
      SELECT 
        id,
        user_name as userName,
        rating,
        comment,
        created_at as date
      FROM reviews
      ORDER BY created_at DESC
    `,
      )
      .all();

    res.json({
      success: true,
      data: reviews,
    });
  }),
);

// Create a new review
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    // Validate request body
    const validation = validateReview(req.body);
    if (!validation.valid) {
      throw new ApiError(400, "Validation failed", "VALIDATION_ERROR");
    }

    const { user_name, rating, comment } = req.body;
    const id = uuidv4();

    try {
      db.prepare(
        `
        INSERT INTO reviews (id, user_name, rating, comment)
        VALUES (?, ?, ?, ?)
      `,
      ).run(id, user_name, parseInt(rating), comment);

      const newReview = db
        .prepare(
          `
        SELECT 
          id,
          user_name as userName,
          rating,
          comment,
          created_at as date
        FROM reviews
        WHERE id = ?
      `,
        )
        .get(id);

      res.status(201).json({
        success: true,
        data: newReview,
        message: "Review created successfully",
      });
    } catch (err) {
      throw new ApiError(500, "Failed to create review", "DATABASE_ERROR");
    }
  }),
);

export default router;
