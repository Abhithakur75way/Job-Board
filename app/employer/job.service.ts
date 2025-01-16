import Job from "../employer/job.schema";
import { IUser } from "../user/user.schema";
import { User } from "../user/user.schema";
import mongoose from "mongoose";

// Job service class to handle all job-related logic
export class JobService {
  // Create a new job
  static async createJob({
    title,
    description,
    location,
    type,
    skills,
    employerId,
  }: any) {
    const job = new Job({
      title,
      description,
      location,
      type,
      skills,
      employer: employerId,
    });

    return await job.save();
  }

  // Get all jobs with filters
  static async getJobs(filter: any) {
    return await Job.find(filter)
      .populate("employer", "name email") // populate employer info
      .exec();
  }

  // Get job details by ID (also for employer to see applications)
  static async getJobById(jobId: string, user: IUser | null) {
    const job = await Job.findById(jobId)
      .populate("employer", "name email") // populate employer info
      .exec();

    if (job && user && user._id.toString() === job.employer.toString()) {
      return job; // Employer can see applications
    } else {
      const { applications, ...jobDetails } = job!.toObject();
      return jobDetails; // Candidate can only see job details without applications
    }
  }

  // Apply for a job
  static async applyForJob(
    jobId: string,
    candidateId: mongoose.Types.ObjectId,
    resumeUrl: string
  ) {
    const job = await Job.findById(jobId);
    if (!job) throw new Error("Job not found");

    const alreadyApplied = job.applications.some(
      (app) => app.candidateId.toString() === candidateId.toString()
    );
    if (alreadyApplied)
      throw new Error("You have already applied for this job");

    job.applications.push({ candidateId: candidateId.toString(), resumeUrl });
    await job.save();

    // Get employer's email for notification
    const employer = await User.findById(job.employer);
    if (!employer) throw new Error("Employer not found");

    return { job, employerEmail: employer.email };
  }
}
