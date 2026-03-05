import { v4 as uuidv4 } from "uuid";
import { initializeDatabase } from "../db/database";
import { Review } from "../db/models/Review";
import dotenv from "dotenv";

dotenv.config();

const seedDatabase = async () => {
  try {
    // Initialize database connection
    await initializeDatabase();

    // Sample reviews to migrate from the app
    const sampleReviews = [
      {
        id: uuidv4(),
        user_name: "Ahmed Sultan",
        rating: 5,
        comment:
          "Absolutely exceptional quality! The fabric is incredibly soft and the fit is perfect. This is true luxury. Highly recommend!",
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      {
        id: uuidv4(),
        user_name: "Mohammed Al-Rashid",
        rating: 5,
        comment:
          "Outstanding craftsmanship. The attention to detail is remarkable. Worth every penny. Will definitely order again!",
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
    ];

    // Clear existing reviews (optional - comment out if you want to preserve old reviews)
    await Review.deleteMany({});

    // Insert sample reviews
    await Review.insertMany(sampleReviews);

    console.log(`\n✓ Database seeded with ${sampleReviews.length} reviews`);
    console.log("✓ Sample reviews created successfully\n");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Run seed if executed directly
seedDatabase();
