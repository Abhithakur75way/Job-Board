import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../user/user.entity'; // Import User entity for the employer reference
import { JobApplication } from './job-application.entity'; // Import JobApplication entity

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column({
    type: 'enum',
    enum: ['full-time', 'part-time', 'contract'],
  })
  type: 'full-time' | 'part-time' | 'contract';

  @Column('text', { array: true }) // To store skills as a string array
  skills: string[];

  @ManyToOne(() => User, (user) => user.jobs) // Each job is associated with an employer (User)
  employer: User;

  @OneToMany(() => JobApplication, (application) => application.job) // Each job can have multiple applications
  applications: JobApplication[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
