import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";
import { Job } from "../employer/job.entity"; // Import Job entity
import bcrypt from "bcrypt";

export interface IUser {
  id: number; // Replace with UUID if using UUIDs
  name: string;
  email: string;
  password: string;
  role: "employer" | "candidate";
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
}

@Entity("users") // Table name in the database
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number; // Or use UUID: @PrimaryGeneratedColumn('uuid')

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: "enum", enum: ["employer", "candidate"] })
  role: "employer" | "candidate";

  @Column({ type: "varchar", nullable: true }) // Fixed type for PostgreSQL
  passwordResetToken?: string | null;

  @Column({ type: "timestamp", nullable: true })
  passwordResetExpires?: Date | null;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  // Define the relationship with the Job entity
  @OneToMany(() => Job, (job) => job.employer)
  jobs: Job[];

  // Hash password before saving
  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 12);
  }
}
