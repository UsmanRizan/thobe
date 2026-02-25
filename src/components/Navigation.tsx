import React from "react";
import { ShoppingBag } from "lucide-react";
import { Page } from "../types";
import { MobileNav } from "./MobileNav";

interface NavigationProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  onCartClick: () => void;
  cartItemCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  onPageChange,
  onCartClick,
  cartItemCount,
}) => {
  return (
    <nav className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <MobileNav currentPage={currentPage} onPageChange={onPageChange} />
        <div className="flex items-center gap-8">
          <button
            onClick={() => onPageChange("home")}
            className="serif text-3xl font-medium tracking-tight hover:opacity-70 transition-opacity"
          >
            AL-ABYAD
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-12 text-sm uppercase tracking-widest font-medium text-black/60">
          <button
            onClick={() => onPageChange("home")}
            className={`hover:text-black transition-colors ${currentPage === "home" ? "text-black font-bold" : ""}`}
          >
            Collection
          </button>
          <button
            onClick={() => onPageChange("track")}
            className={`hover:text-black transition-colors ${currentPage === "track" ? "text-black font-bold" : ""}`}
          >
            Track Order
          </button>
          <button
            onClick={() => onPageChange("contact")}
            className={`hover:text-black transition-colors ${currentPage === "contact" ? "text-black font-bold" : ""}`}
          >
            Contact
          </button>
          <button
            onClick={() => onPageChange("faq")}
            className={`hover:text-black transition-colors ${currentPage === "faq" ? "text-black font-bold" : ""}`}
          >
            FAQ
          </button>
        </div>

        <button
          onClick={onCartClick}
          className="relative p-2 hover:bg-black/5 rounded-full transition-colors"
        >
          <ShoppingBag size={24} strokeWidth={1.5} />
          {cartItemCount > 0 && (
            <span className="absolute top-0 right-0 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};
