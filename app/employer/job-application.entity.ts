import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Job } from './job.entity'; // Import Job entity
import { User } from '../user/user.entity'; // Import User entity for candidate

@Entity('job_applications')
export class JobApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Job, (job) => job.applications)
  @JoinColumn({ name: 'job_id' }) // Foreign key for job
  job: Job;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'candidate_id' }) // Foreign key for candidate
  candidate: User;

  @Column()
  resumeUrl: string;

  @Column({
    type: 'enum',
    enum: ['applied', 'under review', 'interview scheduled', 'rejected', 'hired'],
    default: 'applied',
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
