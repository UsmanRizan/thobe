import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    user_name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "reviews" },
);

// Create index for efficient sorting by creation date
reviewSchema.index({ created_at: -1 });

export const Review = mongoose.model<IReview>("Review", reviewSchema);
