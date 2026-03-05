import Database from "better-sqlite3";
import mongoose from "mongoose";
import path from "path";
import { Order } from "../db/models/Order";
import { Review } from "../db/models/Review";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce";
const DB_PATH = process.env.DB_PATH || "./data/ecommerce.db";

async function migrateToMongoDB() {
  let sqliteDb: Database.Database | null = null;

  try {
    console.log("\n🔄 Starting migration from SQLite to MongoDB...\n");

    // Connect to MongoDB
    console.log("📡 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI, {
      retryWrites: true,
      w: "majority",
    });
    console.log("✓ Connected to MongoDB\n");

    // Open SQLite database
    console.log("📂 Opening SQLite database...");
    sqliteDb = new Database(DB_PATH);
    console.log(`✓ Opened SQLite database at ${DB_PATH}\n`);

    // Clear existing collections (optional - set to false to append)
    const clearExisting = true;
    if (clearExisting) {
      console.log("🗑️  Clearing existing collections...");
      await Order.deleteMany({});
      await Review.deleteMany({});
      console.log("✓ Collections cleared\n");
    }

    // Migrate Orders
    console.log("📋 Migrating orders...");
    const orders = sqliteDb
      .prepare(
        `
        SELECT 
          id,
          customer_name,
          email,
          address,
          phone,
          items,
          total_price,
          status,
          created_at,
          updated_at
        FROM orders
      `,
      )
      .all() as any[];

    let ordersCreated = 0;
    for (const order of orders) {
      try {
        // Parse items JSON if it's a string
        let items = order.items;
        if (typeof items === "string") {
          items = JSON.parse(items);
        }

        await Order.create({
          id: order.id,
          customer_name: order.customer_name,
          email: order.email,
          address: order.address,
          phone: order.phone,
          items: items,
          total_price: order.total_price,
          status: order.status,
          created_at: new Date(order.created_at),
          updated_at: new Date(order.updated_at),
        });
        ordersCreated++;
      } catch (err) {
        console.error(`⚠️  Failed to migrate order ${order.id}:`, err);
      }
    }
    console.log(`✓ Migrated ${ordersCreated}/${orders.length} orders\n`);

    // Migrate Reviews
    console.log("⭐ Migrating reviews...");
    const reviews = sqliteDb
      .prepare(
        `
        SELECT 
          id,
          user_name,
          rating,
          comment,
          created_at
        FROM reviews
      `,
      )
      .all() as any[];

    let reviewsCreated = 0;
    for (const review of reviews) {
      try {
        await Review.create({
          id: review.id,
          user_name: review.user_name,
          rating: review.rating,
          comment: review.comment,
          created_at: new Date(review.created_at),
        });
        reviewsCreated++;
      } catch (err) {
        console.error(`⚠️  Failed to migrate review ${review.id}:`, err);
      }
    }
    console.log(`✓ Migrated ${reviewsCreated}/${reviews.length} reviews\n`);

    // Print summary
    console.log("📊 Migration Summary:");
    console.log(`   Orders: ${ordersCreated} migrated`);
    console.log(`   Reviews: ${reviewsCreated} migrated`);
    console.log(
      `   Total: ${ordersCreated + reviewsCreated} documents migrated\n`,
    );

    // Verify data in MongoDB
    console.log("✅ Verifying data in MongoDB...");
    const orderCount = await Order.countDocuments();
    const reviewCount = await Review.countDocuments();
    console.log(`   Orders in MongoDB: ${orderCount}`);
    console.log(`   Reviews in MongoDB: ${reviewCount}\n`);

    console.log("🎉 Migration completed successfully!\n");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    // Close connections
    if (sqliteDb) {
      sqliteDb.close();
      console.log("✓ SQLite database closed");
    }

    await mongoose.disconnect();
    console.log("✓ MongoDB connection closed\n");
  }
}

// Run migration
migrateToMongoDB();
