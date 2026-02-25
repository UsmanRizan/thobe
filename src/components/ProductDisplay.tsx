import React from "react";
import { motion } from "motion/react";
import { Star, Check } from "lucide-react";
import { Width, Length } from "../types";
import { WIDTHS, LENGTHS } from "../constants/product";

interface ProductDisplayProps {
  selectedWidth: Width;
  onWidthChange: (width: Width) => void;
  selectedLength: Length;
  onLengthChange: (length: Length) => void;
  isAdding: boolean;
  onAddToCart: () => void;
  averageRating: string | number;
  reviewCount: number;
  productName: string;
  productPrice: number;
}

export const ProductDisplay: React.FC<ProductDisplayProps> = ({
  selectedWidth,
  onWidthChange,
  selectedLength,
  onLengthChange,
  isAdding,
  onAddToCart,
  averageRating,
  reviewCount,
  productName,
  productPrice,
}) => {
  const [zoomPos, setZoomPos] = React.useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
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
              <span className="text-xs text-black/30">({reviewCount})</span>
            </div>
          </div>
          <h2 className="serif text-5xl lg:text-6xl font-light leading-tight">
            {productName}
          </h2>
          <p className="text-2xl font-light text-black/60">
            LKR {productPrice.toLocaleString()}
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
                  onClick={() => onWidthChange(width)}
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
                  onClick={() => onLengthChange(length)}
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
            onClick={onAddToCart}
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
              A masterpiece of minimalist design. Our Signature White Thobe is
              crafted from premium, breathable cotton-blend fabric that
              maintains its crisp white brilliance. Featuring a tailored fit
              that balances traditional silhouette with modern comfort.
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
  );
};
