import React from "react";
import { motion } from "motion/react";
import { User, Star } from "lucide-react";
import { Review } from "../../types";

interface ReviewListProps {
  reviews: Review[];
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  return (
    <div className="grid md:grid-cols-2 gap-12">
      {reviews.map((review) => (
        <motion.div
          layout
          key={review.id}
          className="p-8 border border-black/5 rounded-3xl space-y-4"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center">
                <User size={20} className="text-black/20" />
              </div>
              <div>
                <h4 className="text-sm font-bold">{review.userName}</h4>
                <p className="text-[10px] text-black/30 uppercase tracking-widest">
                  {review.date}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-0.5 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < review.rating ? "currentColor" : "none"}
                  stroke="currentColor"
                />
              ))}
            </div>
          </div>
          <p className="text-black/60 leading-relaxed font-light italic">
            "{review.comment}"
          </p>
        </motion.div>
      ))}
    </div>
  );
};
