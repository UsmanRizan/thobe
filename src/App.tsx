/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Page } from "./types";
import {
  Navigation,
  Footer,
  ProductDisplay,
  ShippingPolicy,
  ReturnsExchanges,
  ContactUs,
  OrderTracking,
  FAQ,
  SizeGuide,
  ReviewHeader,
  ReviewForm,
  ReviewList,
  CartDrawer,
  CheckoutModal,
  OrderConfirmationModal,
  AdminDashboard,
} from "./components";
import { useCart, useReviews, useCheckout, usePageMeta } from "./hooks";
import { PRODUCT_NAME, PRODUCT_PRICE } from "./constants/product";

export default function App() {
  const [currentPage, setCurrentPage] = React.useState<Page>("home");
  const [selectedWidth, setSelectedWidth] = React.useState("M" as any);
  const [selectedLength, setSelectedLength] = React.useState("57" as any);
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  // Check if accessing admin dashboard via secret URL
  const isAdminPath = window.location.pathname === "/admin123uzman";

  // If accessing admin path, render admin dashboard only
  if (isAdminPath) {
    return (
      <div className="min-h-screen flex flex-col">
        <AdminDashboard />
      </div>
    );
  }

  const {
    cart,
    setCart,
    addToCart,
    updateQuantity,
    isAdding,
    totalItems,
    totalPrice,
  } = useCart();

  const {
    reviews,
    reviewsLoading,
    isReviewFormOpen,
    setIsReviewFormOpen,
    isSubmittingReview,
    newReview,
    setNewReview,
    handleReviewSubmit,
    averageRating,
  } = useReviews();

  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    isOrderConfirmed,
    setIsOrderConfirmed,
    isCheckoutLoading,
    checkoutError,
    setCheckoutError,
    lastOrder,
    checkoutData,
    setCheckoutData,
    handleCheckout,
  } = useCheckout();

  // Update page meta tags and schema
  usePageMeta(currentPage, averageRating, reviews.length);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onCartClick={() => setIsCartOpen(true)}
        cartItemCount={totalItems}
      />

      <main className="flex-grow pt-20">
        {currentPage === "home" && (
          <>
            <ProductDisplay
              selectedWidth={selectedWidth}
              onWidthChange={setSelectedWidth}
              selectedLength={selectedLength}
              onLengthChange={setSelectedLength}
              isAdding={isAdding}
              onAddToCart={() => {
                addToCart(selectedWidth, selectedLength);
                setIsCartOpen(true);
              }}
              averageRating={averageRating}
              reviewCount={reviews.length}
              productName={PRODUCT_NAME}
              productPrice={PRODUCT_PRICE}
              onSizeGuideClick={() => setCurrentPage("size-guide")}
            />

            {/* Reviews Section */}
            <section className="max-w-7xl mx-auto px-6 py-24 border-t border-black/5">
              <ReviewHeader
                averageRating={averageRating}
                reviewCount={reviews.length}
                isReviewFormOpen={isReviewFormOpen}
                onToggleForm={() => setIsReviewFormOpen(!isReviewFormOpen)}
              />

              <ReviewForm
                isOpen={isReviewFormOpen}
                newReview={newReview}
                setNewReview={setNewReview}
                isSubmitting={isSubmittingReview}
                onSubmit={handleReviewSubmit}
                onToggle={() => setIsReviewFormOpen(!isReviewFormOpen)}
              />

              <ReviewList reviews={reviews} />
            </section>
          </>
        )}

        {currentPage === "shipping" && <ShippingPolicy />}
        {currentPage === "returns" && <ReturnsExchanges />}
        {currentPage === "contact" && <ContactUs />}
        {currentPage === "track" && <OrderTracking />}
        {currentPage === "faq" && <FAQ />}
        {currentPage === "size-guide" && <SizeGuide />}
      </main>

      <Footer onPageChange={setCurrentPage} />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        totalPrice={totalPrice}
        onUpdateQuantity={updateQuantity}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        totalPrice={totalPrice}
        checkoutData={checkoutData}
        setCheckoutData={setCheckoutData}
        isLoading={isCheckoutLoading}
        error={checkoutError}
        onSubmit={(e) =>
          handleCheckout(e, cart, totalPrice, () => {
            setCart([]);
            setIsCartOpen(false);
          })
        }
      />

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        isOpen={isOrderConfirmed}
        onClose={() => setIsOrderConfirmed(false)}
        lastOrder={lastOrder}
      />
    </div>
  );
}
