import { Request, Response, NextFunction } from "express";
import { ApiError } from "./errorHandler";

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export const validateOrder = (data: any): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.customer_name?.trim()) {
    errors.customer_name = "Customer name is required";
  }

  if (!data.email?.trim() || !isValidEmail(data.email)) {
    errors.email = "Valid email is required";
  }

  if (!data.address?.trim()) {
    errors.address = "Address is required";
  }

  if (!data.phone?.trim()) {
    errors.phone = "Phone number is required";
  }

  if (!Array.isArray(data.items) || data.items.length === 0) {
    errors.items = "At least one item is required";
  }

  if (typeof data.total_price !== "number" || data.total_price <= 0) {
    errors.total_price = "Valid total price is required";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateReview = (data: any): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.user_name?.trim()) {
    errors.user_name = "User name is required";
  }

  const rating = parseInt(data.rating);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    errors.rating = "Rating must be between 1 and 5";
  }

  if (!data.comment?.trim() || data.comment.trim().length < 5) {
    errors.comment = "Comment must be at least 5 characters";
  }

  if (data.comment?.trim().length > 500) {
    errors.comment = "Comment must not exceed 500 characters";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequestBody = (
  schema: (data: any) => ValidationResult,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validation = schema(req.body);
    if (!validation.valid) {
      throw new ApiError(400, "Validation failed", "VALIDATION_ERROR");
    }
    next();
  };
};
