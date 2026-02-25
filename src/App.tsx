/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Check,
  ChevronRight,
  Menu,
  Star,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Width, Length, CartItem, Review, Page } from "./types";
import { apiClient } from "./api/client";

const PRODUCT_NAME = "The Signature White Thobe";
const PRODUCT_PRICE = 10000;
const WIDTHS: Width[] = ["S", "M", "L", "XL", "XXL"];
const LENGTHS: Length[] = [
  "53",
  "54",
  "55",
  "56",
  "57",
  "58",
  "59",
  "60",
  "61",
  "62",
];

const ShippingPolicy = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-3xl mx-auto py-24 px-6 space-y-12"
  >
    <h2 className="serif text-5xl">Shipping Policy</h2>
    <div className="space-y-8 text-black/60 font-light leading-relaxed">
      <section className="space-y-4">
        <h3 className="text-black font-bold uppercase tracking-widest text-xs">
          Domestic Shipping (Sri Lanka)
        </h3>
        <p>
          We offer complimentary island-wide shipping on all orders. Delivery
          typically takes 2-4 business days for Colombo and suburbs, and 3-7
          business days for other regions.
        </p>
      </section>
      <section className="space-y-4">
        <h3 className="text-black font-bold uppercase tracking-widest text-xs">
          Order Processing
        </h3>
        <p>
          Orders are processed within 24 hours of placement. You will receive a
          confirmation email with tracking details once your package has been
          dispatched.
        </p>
      </section>
      <section className="space-y-4">
        <h3 className="text-black font-bold uppercase tracking-widest text-xs">
          International Shipping
        </h3>
        <p>
          Currently, we only ship within Sri Lanka. We are working on expanding
          our reach to serve our global community soon.
        </p>
      </section>
    </div>
  </motion.div>
);

const ReturnsExchanges = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-3xl mx-auto py-24 px-6 space-y-12"
  >
    <h2 className="serif text-5xl">Returns & Exchanges</h2>
    <div className="space-y-8 text-black/60 font-light leading-relaxed">
      <section className="space-y-4">
        <h3 className="text-black font-bold uppercase tracking-widest text-xs">
          Our Commitment
        </h3>
        <p>
          We take immense pride in the quality of our thobes. If you are not
          completely satisfied with your purchase, we are here to help.
        </p>
      </section>
      <section className="space-y-4">
        <h3 className="text-black font-bold uppercase tracking-widest text-xs">
          Return Conditions
        </h3>
        <p>
          Items must be returned within 7 days of delivery in their original,
          unworn condition with all tags attached. Please ensure the white
          fabric remains pristine.
        </p>
      </section>
      <section className="space-y-4">
        <h3 className="text-black font-bold uppercase tracking-widest text-xs">
          Exchanges
        </h3>
        <p>
          Need a different width or length? We offer one complimentary exchange
          per order. Contact our support team to initiate the process.
        </p>
      </section>
    </div>
  </motion.div>
);

const ContactUs = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-3xl mx-auto py-24 px-6 space-y-12"
  >
    <h2 className="serif text-5xl">Contact Us</h2>
    <div className="grid md:grid-cols-2 gap-12">
      <div className="space-y-8">
        <section className="space-y-4">
          <h3 className="text-black font-bold uppercase tracking-widest text-xs">
            Inquiries
          </h3>
          <p className="text-black/60 font-light">
            For order status, sizing advice, or general questions:
          </p>
          <p className="font-medium">support@al-abyad.com</p>
        </section>
        <section className="space-y-4">
          <h3 className="text-black font-bold uppercase tracking-widest text-xs">
            Visit Our Atelier
          </h3>
          <p className="text-black/60 font-light">By appointment only.</p>
          <p className="font-medium">
            456 Luxury Row,
            <br />
            Colombo 07, Sri Lanka
          </p>
        </section>
      </div>
      <form
        className="space-y-6 bg-gray-50 p-8 rounded-3xl"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">
            Name
          </label>
          <input
            type="text"
            className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">
            Email
          </label>
          <input
            type="email"
            className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">
            Message
          </label>
          <textarea className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black outline-none h-32" />
        </div>
        <button className="w-full h-14 bg-black text-white rounded-full text-sm uppercase tracking-widest font-bold">
          Send Message
        </button>
      </form>
    </div>
  </motion.div>
);

const OrderTracking = () => {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState<{
    orderId: string;
    status: string;
    estimatedDelivery: string;
    createdAt: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;

    setLoading(true);
    setError(null);
    setStatus(null);

    try {
      const trackingData = await apiClient.trackOrder(orderId);
      setStatus(trackingData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to track order");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "pending":
        return "bg-amber-500";
      case "shipped":
        return "bg-blue-500";
      case "in_delivery":
        return "bg-blue-600";
      case "delivered":
        return "bg-emerald-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "pending":
        return "Processing";
      case "shipped":
        return "Shipped";
      case "in_delivery":
        return "In Delivery";
      case "delivered":
        return "Delivered";
      default:
        return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto py-24 px-6 space-y-12"
    >
      <h2 className="serif text-5xl text-center">Track Your Order</h2>
      <div className="max-w-md mx-auto space-y-8">
        <p className="text-center text-black/60 font-light">
          Enter your order ID to check the current status of your premium thobe.
        </p>
        <form onSubmit={handleTrack} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">
              Order ID
            </label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. ORD-12345"
              className="w-full bg-gray-50 border-none rounded-xl px-4 py-4 text-sm focus:ring-1 focus:ring-black outline-none"
            />
          </div>
          <button
            disabled={loading}
            className="w-full h-14 bg-black text-white rounded-full text-sm uppercase tracking-widest font-bold disabled:opacity-50"
          >
            {loading ? "Tracking..." : "Track Order"}
          </button>
        </form>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 p-4 rounded-2xl border border-red-200 text-red-700 text-sm"
            >
              {error}
            </motion.div>
          )}
          {status && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-50 p-8 rounded-3xl border border-black/5 text-center space-y-6"
            >
              <div>
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-black/40 mb-4">
                  Current Status
                </h3>
                <div className="flex items-center justify-center gap-4">
                  <div
                    className={`w-3 h-3 rounded-full ${getStatusColor(status.status)}`}
                  />
                  <span className="text-2xl font-medium">
                    {getStatusLabel(status.status)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-black/60">
                <p className="font-light">
                  {status.status === "pending" &&
                    "Your order is being carefully prepared at our atelier."}
                  {status.status === "shipped" &&
                    "Your order is on its way to your doorstep."}
                  {status.status === "in_delivery" &&
                    "Your order is out for delivery today."}
                  {status.status === "delivered" &&
                    "Your order has been successfully delivered."}
                </p>
                <p className="text-[12px]">
                  Estimated Delivery:{" "}
                  {new Date(status.estimatedDelivery).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedWidth, setSelectedWidth] = useState<Width>("M");
  const [selectedLength, setSelectedLength] = useState<Length>("57");
  const [isAdding, setIsAdding] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [lastOrder, setLastOrder] = useState<{
    id?: string;
    items: CartItem[];
    total: number;
  } | null>(null);

  // Review State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [newReview, setNewReview] = useState({
    userName: "",
    rating: 5,
    comment: "",
  });
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Checkout State
  const [checkoutData, setCheckoutData] = useState({
    customerName: "",
    email: "",
    address: "",
    phone: "",
  });
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Image Zoom State
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  // Fetch reviews on component mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const fetchedReviews = await apiClient.getReviews();
        setReviews(fetchedReviews);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        // Continue without reviews if fetch fails
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    // Update Title and Meta Description
    let title = "AL-ABYAD | Premium White Thobes";
    let description =
      "Redefining traditional elegance through minimalist design and superior craftsmanship.";

    if (currentPage === "home") {
      title = `${PRODUCT_NAME} | AL-ABYAD Premium Menswear`;
      description = `Discover the ${PRODUCT_NAME} by AL-ABYAD. Premium cotton-blend, minimalist design, and superior craftsmanship. Shop now for LKR ${PRODUCT_PRICE.toLocaleString()}.`;
    } else if (currentPage === "shipping") {
      title = "Shipping Policy | AL-ABYAD";
      description =
        "Learn about our complimentary island-wide shipping in Sri Lanka and order processing times.";
    } else if (currentPage === "returns") {
      title = "Returns & Exchanges | AL-ABYAD";
      description =
        "Our commitment to quality. Read about our 7-day return policy and complimentary exchanges.";
    } else if (currentPage === "contact") {
      title = "Contact Us | AL-ABYAD";
      description =
        "Get in touch with our team for inquiries, sizing advice, or to visit our atelier in Colombo.";
    } else if (currentPage === "track") {
      title = "Track Order | AL-ABYAD";
      description =
        "Check the real-time status of your AL-ABYAD order using your Order ID.";
    }

    document.title = title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }

    // Schema Markup (JSON-LD)
    const existingScript = document.getElementById("product-schema");
    if (existingScript) {
      existingScript.remove();
    }

    if (currentPage === "home") {
      const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: PRODUCT_NAME,
        image: ["https://picsum.photos/seed/thobe-main/1200/1600"],
        description:
          "A masterpiece of minimalist design. Our Signature White Thobe is crafted from premium, breathable cotton-blend fabric.",
        brand: {
          "@type": "Brand",
          name: "AL-ABYAD",
        },
        offers: {
          "@type": "Offer",
          url: window.location.href,
          priceCurrency: "LKR",
          price: PRODUCT_PRICE,
          availability: "https://schema.org/InStock",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: averageRating,
          reviewCount: reviews.length,
        },
      };

      const script = document.createElement("script");
      script.id = "product-schema";
      script.type = "application/ld+json";
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [currentPage, averageRating, reviews.length]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const addToCart = () => {
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 1000);

    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.width === selectedWidth && item.length === selectedLength,
      );
      if (existing) {
        return prev.map((item) =>
          item.width === selectedWidth && item.length === selectedLength
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          name: PRODUCT_NAME,
          price: PRODUCT_PRICE,
          width: selectedWidth,
          length: selectedLength,
          quantity: 1,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = Math.max(0, item.quantity + delta);
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.userName || !newReview.comment) return;

    setIsSubmittingReview(true);
    try {
      const createdReview = await apiClient.createReview({
        user_name: newReview.userName,
        rating: newReview.rating,
        comment: newReview.comment,
      });

      // Add the new review to the list (convert API format to component format)
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

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setCurrentPage("home")}
              className="serif text-3xl font-medium tracking-tight hover:opacity-70 transition-opacity"
            >
              AL-ABYAD
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-12 text-sm uppercase tracking-widest font-medium text-black/60">
            <button
              onClick={() => setCurrentPage("home")}
              className={`hover:text-black transition-colors ${currentPage === "home" ? "text-black font-bold" : ""}`}
            >
              Collection
            </button>
            <button
              onClick={() => setCurrentPage("track")}
              className={`hover:text-black transition-colors ${currentPage === "track" ? "text-black font-bold" : ""}`}
            >
              Track Order
            </button>
            <button
              onClick={() => setCurrentPage("contact")}
              className={`hover:text-black transition-colors ${currentPage === "contact" ? "text-black font-bold" : ""}`}
            >
              Contact
            </button>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <ShoppingBag size={24} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      <main className="flex-grow pt-20">
        {currentPage === "home" && (
          <>
            <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24 grid lg:grid-cols-2 gap-16 items-start">
              {/* Product Images */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setIsZooming(true)}
                  onMouseLeave={() => setIsZooming(false)}
                  className="aspect-[3/4] bg-[#F5F5F0] rounded-2xl overflow-hidden relative group cursor-zoom-in"
                >
                  <img
                    src="https://picsum.photos/seed/thobe-main/1200/1600"
                    alt="Signature White Thobe - Full Length View"
                    className={`w-full h-full object-cover mix-blend-multiply opacity-90 transition-transform duration-200 ease-out ${isZooming ? "scale-[2.5]" : "scale-100"}`}
                    style={{
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    }}
                    referrerPolicy="no-referrer"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-300 ${isZooming ? "opacity-0" : "opacity-0 group-hover:opacity-100"}`}
                  />
                </motion.div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="aspect-[3/4] bg-[#F5F5F0] rounded-2xl overflow-hidden">
                    <img
                      src="https://picsum.photos/seed/thobe-detail-1/600/800"
                      alt="Signature White Thobe - Collar and Button Detail"
                      className="w-full h-full object-cover mix-blend-multiply opacity-80"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="aspect-[3/4] bg-[#F5F5F0] rounded-2xl overflow-hidden">
                    <img
                      src="https://picsum.photos/seed/thobe-child/600/800"
                      alt="Signature White Thobe - Junior Sizes Available"
                      className="w-full h-full object-cover mix-blend-multiply opacity-80"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="lg:sticky lg:top-32 space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-black/40 font-semibold">
                      <span>Essential Collection</span>
                      <span className="w-1 h-1 bg-black/20 rounded-full" />
                      <span>In Stock</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={14} fill="currentColor" />
                      <span className="text-sm font-medium text-black/60">
                        {averageRating}
                      </span>
                      <span className="text-xs text-black/30">
                        ({reviews.length})
                      </span>
                    </div>
                  </div>
                  <h2 className="serif text-5xl lg:text-6xl font-light leading-tight">
                    {PRODUCT_NAME}
                  </h2>
                  <p className="text-2xl font-light text-black/60">
                    LKR {PRODUCT_PRICE.toLocaleString()}
                  </p>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <label className="text-xs uppercase tracking-widest font-bold text-black/40">
                        Width :
                      </label>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {WIDTHS.map((width) => (
                        <button
                          key={width}
                          onClick={() => setSelectedWidth(width)}
                          className={`
                            w-14 h-14 rounded-full border flex items-center justify-center text-sm font-medium transition-all
                            ${
                              selectedWidth === width
                                ? "border-black bg-black text-white shadow-lg"
                                : "border-black/10 hover:border-black/30 bg-white text-black/60"
                            }
                          `}
                        >
                          {width}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs uppercase tracking-widest font-bold text-black/40">
                      Length :
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {LENGTHS.map((length) => (
                        <button
                          key={length}
                          onClick={() => setSelectedLength(length)}
                          className={`
                            w-14 h-14 rounded-full border flex items-center justify-center text-sm font-medium transition-all
                            ${
                              selectedLength === length
                                ? "border-black bg-black text-white shadow-lg"
                                : "border-black/10 hover:border-black/30 bg-white text-black/60"
                            }
                          `}
                        >
                          {length}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={addToCart}
                    disabled={isAdding}
                    className={`
                      w-full h-16 rounded-full flex items-center justify-center text-sm uppercase tracking-widest font-bold transition-all
                      ${isAdding ? "bg-emerald-500 text-white" : "bg-black text-white hover:bg-black/90 active:scale-[0.98]"}
                    `}
                  >
                    {isAdding ? (
                      <span className="flex items-center gap-2">
                        <Check size={18} /> Added to Bag
                      </span>
                    ) : (
                      "Add to Bag"
                    )}
                  </button>
                  <p className="text-center text-xs text-black/40">
                    Free shipping on all orders within Sri Lanka.
                  </p>
                </div>

                <div className="pt-10 border-t border-black/5 space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-widest font-bold">
                      Description
                    </h3>
                    <p className="text-black/60 leading-relaxed font-light">
                      A masterpiece of minimalist design. Our Signature White
                      Thobe is crafted from premium, breathable cotton-blend
                      fabric that maintains its crisp white brilliance.
                      Featuring a tailored fit that balances traditional
                      silhouette with modern comfort.
                    </p>
                  </div>
                  <ul className="space-y-3 text-sm text-black/60 font-light">
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-black/20 rounded-full" />
                      Premium 100% Cotton-Blend
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-black/20 rounded-full" />
                      Hidden Side Pockets
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-black/20 rounded-full" />
                      Classic Mandarin Collar
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <section className="max-w-7xl mx-auto px-6 py-24 border-t border-black/5">
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
                    <span className="text-lg font-medium">
                      {averageRating} out of 5
                    </span>
                    <span className="text-black/40 text-sm">
                      Based on {reviews.length} reviews
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                  className="px-8 py-4 bg-black text-white rounded-full text-xs uppercase tracking-widest font-bold hover:bg-black/80 transition-colors"
                >
                  {isReviewFormOpen ? "Cancel Review" : "Write a Review"}
                </button>
              </div>

              <AnimatePresence>
                {isReviewFormOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-16"
                  >
                    <form
                      onSubmit={handleReviewSubmit}
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
                                    star <= newReview.rating
                                      ? "currentColor"
                                      : "none"
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
                        disabled={isSubmittingReview}
                        className="px-8 py-4 bg-black text-white rounded-full text-xs uppercase tracking-widest font-bold disabled:opacity-50"
                      >
                        {isSubmittingReview ? "Submitting..." : "Submit Review"}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

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
                          <h4 className="text-sm font-bold">
                            {review.userName}
                          </h4>
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
            </section>
          </>
        )}

        {currentPage === "shipping" && <ShippingPolicy />}
        {currentPage === "returns" && <ReturnsExchanges />}
        {currentPage === "contact" && <ContactUs />}
        {currentPage === "track" && <OrderTracking />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-black/5 py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <h2 className="serif text-2xl">AL-ABYAD</h2>
            <p className="text-sm text-black/40 leading-relaxed">
              Redefining traditional elegance through minimalist design and
              superior craftsmanship.
            </p>
          </div>
          <div className="space-y-6">
            <h3 className="text-xs uppercase tracking-widest font-bold">
              Support
            </h3>
            <ul className="space-y-3 text-sm text-black/60">
              <li>
                <button
                  onClick={() => setCurrentPage("shipping")}
                  className="hover:text-black"
                >
                  Shipping Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage("returns")}
                  className="hover:text-black"
                >
                  Returns & Exchanges
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage("track")}
                  className="hover:text-black"
                >
                  Track Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage("contact")}
                  className="hover:text-black"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>
          <div className="space-y-6">
            <h3 className="text-xs uppercase tracking-widest font-bold">
              Newsletter
            </h3>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="flex-grow bg-black/5 border-none rounded-full px-6 py-3 text-sm focus:ring-1 focus:ring-black outline-none"
              />
              <button className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between gap-6 text-[10px] uppercase tracking-widest font-bold text-black/30">
          <p>© 2024 AL-ABYAD. All Rights Reserved.</p>
          <div className="flex gap-8">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-8 flex items-center justify-between border-b border-black/5">
                <h3 className="serif text-2xl">Your Bag</h3>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-8 space-y-8">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center">
                      <ShoppingBag size={24} className="text-black/20" />
                    </div>
                    <p className="text-black/40 font-light">
                      Your bag is currently empty.
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="text-sm uppercase tracking-widest font-bold underline"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-6">
                      <div className="w-24 h-32 bg-[#F5F5F0] rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src="https://picsum.photos/seed/thobe-main/200/300"
                          alt={item.name}
                          className="w-full h-full object-cover mix-blend-multiply opacity-80"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-grow space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-sm font-light">
                            LKR {item.price.toLocaleString()}
                          </p>
                        </div>
                        <p className="text-xs text-black/40 uppercase tracking-widest">
                          Width: {item.width} | Length: {item.length}
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                          <div className="flex items-center border border-black/10 rounded-full px-2 py-1">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 hover:text-black text-black/40 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-xs font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 hover:text-black text-black/40 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, -item.quantity)
                            }
                            className="text-[10px] uppercase tracking-widest font-bold text-black/30 hover:text-red-500 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 border-t border-black/5 space-y-6 bg-gray-50/50">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-black/40">Subtotal</span>
                      <span>LKR {totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-black/40">Shipping</span>
                      <span className="text-emerald-600">Free</span>
                    </div>
                    <div className="flex justify-between text-lg font-medium pt-4 border-t border-black/5">
                      <span>Total</span>
                      <span>LKR {totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full h-14 bg-black text-white rounded-full text-sm uppercase tracking-widest font-bold hover:bg-black/90 transition-all active:scale-[0.98]"
                  >
                    Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal (Simplified) */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="grid md:grid-cols-2">
                <div className="p-10 space-y-8">
                  <div className="space-y-2">
                    <h3 className="serif text-3xl">Checkout</h3>
                    <p className="text-sm text-black/40">
                      Complete your order details.
                    </p>
                  </div>
                  <form
                    className="space-y-4"
                    onSubmit={async (e) => {
                      e.preventDefault();

                      if (
                        !checkoutData.customerName ||
                        !checkoutData.email ||
                        !checkoutData.address ||
                        !checkoutData.phone
                      ) {
                        setCheckoutError("Please fill in all fields");
                        return;
                      }

                      setCheckoutError(null);
                      setIsCheckoutLoading(true);

                      try {
                        const createdOrder = await apiClient.createOrder({
                          customer_name: checkoutData.customerName,
                          email: checkoutData.email,
                          address: checkoutData.address,
                          phone: checkoutData.phone,
                          items: cart,
                          total_price: totalPrice,
                        });

                        setLastOrder({
                          id: createdOrder.id,
                          items: [...cart],
                          total: totalPrice,
                        });
                        setCart([]);
                        setIsCheckoutOpen(false);
                        setIsCartOpen(false);
                        setIsOrderConfirmed(true);
                        setCheckoutData({
                          customerName: "",
                          email: "",
                          address: "",
                          phone: "",
                        });
                      } catch (err) {
                        setCheckoutError(
                          err instanceof Error
                            ? err.message
                            : "Failed to create order. Please try again.",
                        );
                      } finally {
                        setIsCheckoutLoading(false);
                      }
                    }}
                  >
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">
                        Full Name
                      </label>
                      <input
                        required
                        type="text"
                        value={checkoutData.customerName}
                        onChange={(e) =>
                          setCheckoutData({
                            ...checkoutData,
                            customerName: e.target.value,
                          })
                        }
                        className="w-full bg-black/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black outline-none"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">
                        Email Address
                      </label>
                      <input
                        required
                        type="email"
                        value={checkoutData.email}
                        onChange={(e) =>
                          setCheckoutData({
                            ...checkoutData,
                            email: e.target.value,
                          })
                        }
                        className="w-full bg-black/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black outline-none"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">
                        Shipping Address
                      </label>
                      <textarea
                        required
                        value={checkoutData.address}
                        onChange={(e) =>
                          setCheckoutData({
                            ...checkoutData,
                            address: e.target.value,
                          })
                        }
                        className="w-full bg-black/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black outline-none h-24"
                        placeholder="123 Galle Road, Colombo 03"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">
                        Phone Number
                      </label>
                      <input
                        required
                        type="tel"
                        value={checkoutData.phone}
                        onChange={(e) =>
                          setCheckoutData({
                            ...checkoutData,
                            phone: e.target.value,
                          })
                        }
                        className="w-full bg-black/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black outline-none"
                        placeholder="+94 77 123 4567"
                      />
                    </div>
                    {checkoutError && (
                      <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg border border-red-200">
                        {checkoutError}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isCheckoutLoading}
                      className="w-full h-14 bg-black text-white rounded-full text-sm uppercase tracking-widest font-bold mt-4 disabled:opacity-50"
                    >
                      {isCheckoutLoading ? "Processing..." : "Place Order"}
                    </button>
                  </form>
                </div>
                <div className="bg-gray-50 p-10 space-y-8">
                  <h4 className="text-xs uppercase tracking-widest font-bold">
                    Order Summary
                  </h4>
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-black/60">
                          {item.quantity}x {item.name} (W:{item.width} L:
                          {item.length})
                        </span>
                        <span>
                          LKR {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-black/5 flex justify-between font-bold">
                      <span>Total</span>
                      <span>LKR {totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-2xl flex items-start gap-3">
                    <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={12} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-900">
                        Cash on Delivery
                      </p>
                      <p className="text-[10px] text-emerald-700 mt-1">
                        Pay when your premium thobe arrives at your doorstep.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Confirmation Modal */}
      <AnimatePresence>
        {isOrderConfirmed && lastOrder && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOrderConfirmed(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden p-12 text-center"
            >
              <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-200">
                <Check size={40} strokeWidth={3} />
              </div>
              <h3 className="serif text-4xl mb-4">Order Confirmed</h3>
              <p className="text-black/40 font-light mb-10">
                Thank you for choosing Al-Abyad. Your premium thobe is being
                prepared for delivery.
              </p>

              <div className="bg-gray-50 rounded-3xl p-8 mb-10 text-left space-y-4">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-black/40 border-b border-black/5 pb-4">
                  Order Details
                </h4>
                {lastOrder?.id && (
                  <div className="space-y-2 mb-4">
                    <p className="text-xs text-black/60">Order ID:</p>
                    <p className="font-mono text-sm font-bold text-black">
                      {lastOrder.id}
                    </p>
                  </div>
                )}
                {lastOrder?.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-black/60">
                      {item.quantity}x {item.name} (W:{item.width} L:
                      {item.length})
                    </span>
                    <span className="font-medium">
                      LKR {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="pt-4 border-t border-black/5 flex justify-between font-bold text-lg">
                  <span>Total Paid</span>
                  <span>LKR {lastOrder?.total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => setIsOrderConfirmed(false)}
                className="w-full h-16 bg-black text-white rounded-full text-sm uppercase tracking-widest font-bold hover:bg-black/90 transition-all active:scale-[0.98]"
              >
                Continue Shopping
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
