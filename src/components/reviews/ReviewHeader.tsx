import React from "react";
import { Star } from "lucide-react";

interface ReviewHeaderProps {
  averageRating: string | number;
  reviewCount: number;
  isReviewFormOpen: boolean;
  onToggleForm: () => void;
}

export const ReviewHeader: React.FC<ReviewHeaderProps> = ({
  averageRating,
  reviewCount,
  isReviewFormOpen,
  onToggleForm,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
      <div className="space-y-2">
        <h3 className="serif text-4xl">Customer Reviews</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                fill={
                  i < Math.round(Number(averageRating))
                    ? "currentColor"
                    : "none"
                }
                stroke="currentColor"
              />
            ))}
          </div>
          <span className="text-lg font-medium">{averageRating} out of 5</span>
          <span className="text-black/40 text-sm">
            Based on {reviewCount} reviews
          </span>
        </div>
      </div>
      <button
        onClick={onToggleForm}
        className="px-8 py-4 bg-black text-white rounded-full text-xs uppercase tracking-widest font-bold hover:bg-black/80 transition-colors"
      >
        {isReviewFormOpen ? "Cancel Review" : "Write a Review"}
      </button>
    </div>
  );
};
