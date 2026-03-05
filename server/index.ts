import dotenv from "dotenv";

// Load environment variables FIRST, before any other imports
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { initializeDatabase, closeDatabase } from "./db/database";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { errorHandler, asyncHandler } from "./middleware/errorHandler";
import reviewRoutes from "./routes/reviews";
import orderRoutes from "./routes/orders";
import {
  testMailerConnection,
  sendOrderConfirmation,
} from "./services/emailService";
import {
  getOrderConfirmationHTML,
  formatOrderForEmail,
} from "./utils/emailTemplate";

const app = express();
const PORT = parseInt(process.env.PORT || "3001", 10);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the Vite build output directory (frontend)
// This serves the React app's compiled files and handles client-side routing
const staticDir = path.join(__dirname, "..", "dist");
app.use(express.static(staticDir));

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Test email endpoint - Verify email configuration is working
app.post(
  "/api/test-email",
  asyncHandler(async (req: Request, res: Response) => {
    const { email, testMessage } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Email address is required",
          code: "MISSING_EMAIL",
        },
      });
    }

    try {
      // Verify SMTP connection first
      const isConnected = await testMailerConnection();

      if (!isConnected) {
        return res.status(500).json({
          success: false,
          error: {
            message: "Failed to connect to SMTP server",
            code: "SMTP_CONNECTION_FAILED",
          },
        });
      }

      // Create a test order object
      const testOrder = {
        id: "test-" + Date.now(),
        customer_name: "Test Customer",
        email: email,
        address: "123 Test Street, Test City, TC 12345",
        phone: "+1 (555) 123-4567",
        items: JSON.stringify([
          {
            name: "Premium Thobe",
            quantity: 1,
            price: 89.99,
            size: "L",
          },
        ]),
        total_price: 89.99,
        status: "pending",
        created_at: new Date().toISOString(),
      };

      const emailFormattedOrder = formatOrderForEmail(testOrder);
      const htmlContent = getOrderConfirmationHTML(emailFormattedOrder);

      await sendOrderConfirmation(testOrder, htmlContent);

      res.json({
        success: true,
        message: "Test email sent successfully",
        data: {
          recipientEmail: email,
          orderId: testOrder.id,
          note:
            process.env.SMTP_HOST === "smtp.ethereal.email"
              ? "Check your Ethereal Email inbox at https://ethereal.email"
              : "Check your email inbox",
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          message: "Failed to send test email",
          code: "EMAIL_SEND_FAILED",
          details: error instanceof Error ? error.message : "Unknown error",
        },
      });
    }
  }),
);

// Routes
app.use("/api/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes);

// SPA fallback: serve index.html for all non-API routes
// This allows React Router to handle client-side routing
app.get("*", (req: Request, res: Response) => {
  const indexPath = path.join(staticDir, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(500).json({
        success: false,
        error: {
          message: "Unable to serve the application",
          code: "INTERNAL_ERROR",
        },
      });
    }
  });
});

// 404 handler (fallback, may not reach here due to SPA fallback above)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      message: "Route not found",
      code: "NOT_FOUND",
    },
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server with async database initialization
async function startServer() {
  try {
    await initializeDatabase();

    const server = app.listen(PORT, () => {
      console.log(`\n🚀 Server running at http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health\n`);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("SIGTERM received, shutting down gracefully");
      server.close(async () => {
        await closeDatabase();
        console.log("Server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
