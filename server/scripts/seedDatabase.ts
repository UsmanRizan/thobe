import { v4 as uuidv4 } from "uuid";
import db, { initializeDatabase } from "../db/database";

const seedDatabase = () => {
  // Initialize database first
  initializeDatabase();

  // Sample reviews to migrate from the app
  const sampleReviews = [
    {
      id: uuidv4(),
      user_name: "Ahmed Sultan",
      rating: 5,
      comment:
        "Absolutely exceptional quality! The fabric is incredibly soft and the fit is perfect. This is true luxury. Highly recommend!",
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    },
    {
      id: uuidv4(),
      user_name: "Mohammed Al-Rashid",
      rating: 5,
      comment:
        "Outstanding craftsmanship. The attention to detail is remarkable. Worth every penny. Will definitely order again!",
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    },
  ];

  try {
    // Clear existing reviews (optional - comment out if you want to preserve old reviews)
    db.prepare("DELETE FROM reviews").run();

    // Insert sample reviews
    const insertStmt = db.prepare(
      `
      INSERT INTO reviews (id, user_name, rating, comment, created_at)
      VALUES (?, ?, ?, ?, ?)
    `,
    );

    sampleReviews.forEach((review) => {
      insertStmt.run(
        review.id,
        review.user_name,
        review.rating,
        review.comment,
        review.created_at,
      );
    });

    console.log(`\n✓ Database seeded with ${sampleReviews.length} reviews`);
    console.log("✓ Sample reviews migrated successfully\n");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Run seed if executed directly
seedDatabase();
