import React from "react";
import { Minus, Plus } from "lucide-react";
import { CartItem } from "../../types";

interface CartItemComponentProps {
  item: CartItem;
  onUpdateQuantity: (id: string, delta: number) => void;
}

export const CartItemComponent: React.FC<CartItemComponentProps> = ({
  item,
  onUpdateQuantity,
}) => {
  return (
    <div className="flex gap-6">
      <div className="w-24 h-32 bg-[#F5F5F0] rounded-xl overflow-hidden flex-shrink-0">
        <img
          src="/thobe2.png"
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
              onClick={() => onUpdateQuantity(item.id, -1)}
              className="p-1 hover:text-black text-black/40 transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-xs font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, 1)}
              className="p-1 hover:text-black text-black/40 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
          <button
            onClick={() => onUpdateQuantity(item.id, -item.quantity)}
            className="text-[10px] uppercase tracking-widest font-bold text-black/30 hover:text-red-500 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};
