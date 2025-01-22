import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { User } from "./user/user.entity";
import { Job } from "./employer/job.entity";
import { JobApplication } from "./employer/job-application.entity";

// Load environment variables
dotenv.config();

console.log("Database Config:");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS ? "Loaded" : "Not Loaded");
console.log("DB_NAME:", process.env.DB_NAME);

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true, // Always false in production
  logging: false,
  entities: [User, Job, JobApplication],
  migrations: [__dirname + "/migrations/*{.ts,.js}"],
  subscribers: [],
});

// Initialize the DataSource (important for your connection to work)
