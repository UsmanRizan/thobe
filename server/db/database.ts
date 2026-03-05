import mongoose from "mongoose";
import dotenv from "dotenv";
import { Order } from "./models/Order";
import { Review } from "./models/Review";

// Ensure environment variables are loaded
dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce";

export async function initializeDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      retryWrites: true,
      w: "majority",
    });

    console.log("✓ Connected to MongoDB");

    // Create indexes
    await Order.collection.createIndex({ created_at: -1 });
    await Review.collection.createIndex({ created_at: -1 });

    console.log("✓ Database indexes created");
  } catch (error) {
    console.error("✗ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

export async function closeDatabase() {
  try {
    await mongoose.disconnect();
    console.log("✓ Disconnected from MongoDB");
  } catch (error) {
    console.error("✗ Failed to disconnect from MongoDB:", error);
  }
}

export { Order, Review };
