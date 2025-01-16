import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import connectDB from "./config/db";

import authRoutes from "./routes/user.routes";
import jobRoutes from "./routes/job.routes";
import { swaggerDocs } from "./swagger"; // Import swaggerDocs

dotenv.config();

const app = express();

connectDB();

app.use(express.json()); // Middleware to parse JSON requests

// Swagger docs route
swaggerDocs(app);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Job Board API");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
