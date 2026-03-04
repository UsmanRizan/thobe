import React from "react";
import { ChevronRight } from "lucide-react";
import { Page } from "../types";

interface FooterProps {
  onPageChange: (page: Page) => void;
}

export const Footer: React.FC<FooterProps> = ({ onPageChange }) => {
  return (
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
                onClick={() => onPageChange("size-guide")}
                className="hover:text-black"
              >
                Size Guide
              </button>
            </li>
            <li>
              <button
                onClick={() => onPageChange("shipping")}
                className="hover:text-black"
              >
                Shipping Policy
              </button>
            </li>
            <li>
              <button
                onClick={() => onPageChange("returns")}
                className="hover:text-black"
              >
                Returns & Exchanges
              </button>
            </li>
            <li>
              <button
                onClick={() => onPageChange("track")}
                className="hover:text-black"
              >
                Track Order
              </button>
            </li>
            <li>
              <button
                onClick={() => onPageChange("contact")}
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
  );
};
