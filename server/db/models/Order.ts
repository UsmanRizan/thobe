import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  id: string;
  name: string;
  price: number;
  width: string;
  length: string;
  quantity: number;
}

export interface IOrder extends Document {
  id: string;
  customer_name: string;
  email: string;
  address: string;
  phone: string;
  items: IOrderItem[];
  total_price: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  created_at: Date;
  updated_at: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    customer_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    items: [
      {
        id: String,
        name: String,
        price: Number,
        width: String,
        length: String,
        quantity: Number,
      },
    ],
    total_price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered"],
      default: "pending",
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "orders" },
);

// Create index for efficient sorting by creation date
orderSchema.index({ created_at: -1 });

export const Order = mongoose.model<IOrder>("Order", orderSchema);
