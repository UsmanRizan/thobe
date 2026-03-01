import { useState, useEffect, type FormEvent } from "react";
import { Review } from "../types";
import { apiClient } from "../api/client";

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [newReview, setNewReview] = useState({
    userName: "",
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const fetchedReviews = await apiClient.getReviews();
        setReviews(fetchedReviews);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newReview.userName || !newReview.comment) return;

    setIsSubmittingReview(true);
    try {
      const createdReview = await apiClient.createReview({
        user_name: newReview.userName,
        rating: newReview.rating,
        comment: newReview.comment,
      });

      const formattedReview: Review = {
        id: createdReview.id,
        userName: createdReview.userName,
        rating: createdReview.rating,
        comment: createdReview.comment,
        date: createdReview.date,
      };

      setReviews([formattedReview, ...reviews]);
      setNewReview({ userName: "", rating: 5, comment: "" });
      setIsReviewFormOpen(false);
    } catch (err) {
      console.error("Failed to submit review:", err);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  return {
    reviews,
    reviewsLoading,
    isReviewFormOpen,
    setIsReviewFormOpen,
    isSubmittingReview,
    newReview,
    setNewReview,
    handleReviewSubmit,
    averageRating,
  };
};
