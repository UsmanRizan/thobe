import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star } from "lucide-react";
import { Review } from "../../types";

interface ReviewFormProps {
  isOpen: boolean;
  newReview: {
    userName: string;
    rating: number;
    comment: string;
  };
  setNewReview: (review: any) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onToggle: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  isOpen,
  newReview,
  setNewReview,
  isSubmitting,
  onSubmit,
  onToggle,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden mb-16"
        >
          <form
            onSubmit={onSubmit}
            className="max-w-2xl bg-gray-50 p-10 rounded-3xl space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">
                  Your Name
                </label>
                <input
                  required
                  type="text"
                  value={newReview.userName}
                  onChange={(e) =>
                    setNewReview({
                      ...newReview,
                      userName: e.target.value,
                    })
                  }
                  className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black outline-none"
                  placeholder="Ahmed R."
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">
                  Rating
                </label>
                <div className="flex items-center gap-2 h-11">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setNewReview({ ...newReview, rating: star })
                      }
                      className="text-amber-500 hover:scale-110 transition-transform"
                    >
                      <Star
                        size={24}
                        fill={
                          star <= newReview.rating ? "currentColor" : "none"
                        }
                        stroke="currentColor"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">
                Comment
              </label>
              <textarea
                required
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({
                    ...newReview,
                    comment: e.target.value,
                  })
                }
                className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black outline-none h-32"
                placeholder="Share your thoughts about the thobe..."
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-4 bg-black text-white rounded-full text-xs uppercase tracking-widest font-bold disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
