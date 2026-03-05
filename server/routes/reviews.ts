import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Review } from "../db/models/Review";
import { asyncHandler, ApiError } from "../middleware/errorHandler";
import { validateReview } from "../middleware/validation";

const router = Router();

// Get all reviews
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const reviews = await Review.find().sort({ created_at: -1 }).lean();

    // Format response with camelCase field names
    const formattedReviews = reviews.map((review: any) => ({
      id: review.id,
      userName: review.user_name,
      rating: review.rating,
      comment: review.comment,
      date: review.created_at.toISOString(),
    }));

    res.json({
      success: true,
      data: formattedReviews,
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
      const newReview = await Review.create({
        id,
        user_name,
        rating: parseInt(rating),
        comment,
        created_at: new Date(),
      });

      // Format response with camelCase field names
      const reviewData = {
        id: newReview.id,
        userName: newReview.user_name,
        rating: newReview.rating,
        comment: newReview.comment,
        date: newReview.created_at.toISOString(),
      };

      res.status(201).json({
        success: true,
        data: reviewData,
        message: "Review created successfully",
      });
    } catch (err) {
      throw new ApiError(500, "Failed to create review", "DATABASE_ERROR");
    }
  }),
);

export default router;
