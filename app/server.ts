import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import connectDB from "./config/db";
import cors from "cors";

import authRoutes from "./user/user.routes";
import jobRoutes from "./employer/job.routes";
import { swaggerDocs } from "./swagger"; // Swagger docs import
import { apiRateLimiter, authRateLimiter } from "./common/middleware/limiter.middleware"; // Import rate limiters

dotenv.config();

const app = express();
app.use(cors());
connectDB();

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

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
