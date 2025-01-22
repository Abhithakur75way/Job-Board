import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { User } from "./user/user.entity";
import { Job } from "./employer/job.entity";
import { JobApplication } from "./employer/job-application.entity";

// Load environment variables
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false, // Disable synchronization
  logging: false,
  entities: [User , Job, JobApplication],
  migrations: [__dirname + "/migrations/*{.ts,.js}"], // Specify migration directory
  subscribers: [],
});