import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./user/user.routes";
import jobRoutes from "./employer/job.routes";
import { swaggerDocs } from "./swagger"; // Swagger docs import
import { apiRateLimiter, authRateLimiter } from "./common/middleware/limiter.middleware"; // Import rate limiters
import { AppDataSource } from "./data-source";

dotenv.config();
const app = express();
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error during Data Source initialization", error);
  });


app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests

// Swagger docs route
swaggerDocs(app);

// Apply rate limiter globally to all API routes
app.use("/api", apiRateLimiter);

// Authentication routes (stricter limits for login attempts)
app.use("/api/auth", authRateLimiter, authRoutes);

// Job-related routes
app.use("/api/jobs", jobRoutes);

// Example root endpoint
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Job Board API");
});

// Initialize the DataSource (important for your connection to work)
