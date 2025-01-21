import Job from "../employer/job.schema";
import { IUser } from "../user/user.schema";
import { User } from "../user/user.schema";
import mongoose, { Types } from "mongoose";

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
      .populate("employer", "name email") // Populate employer info
      .exec();
  }

  // Get job details by ID (also for employer to see applications)
  static async getJobById(jobId: string, user: IUser | null) {
    const job = await Job.findById(jobId)
      .populate("employer", "name email") // Populate employer info
      .exec();

    if (!job) throw new Error("Job not found");

    if (user && user._id.toString() === job.employer.toString()) {
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
    if (alreadyApplied) throw new Error("You have already applied for this job");

    job.applications.push({
      candidateId,
      resumeUrl,
      status: "applied",
    });
    await job.save();

    // Get employer's email for notification
    const employer = await User.findById(job.employer);
    if (!employer) throw new Error("Employer not found");

    return { job, employerEmail: employer.email };
  }

  // Fetch all applications for a candidate
  static async getCandidateApplications(candidateId: Types.ObjectId) {
    // Find jobs where the candidate has applied
    const jobs = await Job.find({
      "applications.candidateId": candidateId,
    }).populate("employer", "name email"); // Populate employer details

    // Transform the applications data for the candidate
    const applications = jobs.map((job) => {
      const application = job.applications.find(
        (app) => app.candidateId.toString() === candidateId.toString()
      );

      return {
        jobId: job._id,
        jobTitle: job.title,
        employer: job.employer,
        location: job.location,
        status: application?.status || "Unknown",
        appliedAt: application?.createdAt || job.createdAt, // Use job's createdAt if application createdAt is missing
      };
    });

    return applications;
  }

  // Update the status of a candidate's application
  static async updateApplicationStatus(
    jobId: string,
    candidateId: string,
    status: string
  ) {
    // Ensure the provided status is valid
    const validStatuses = [
      "applied",
      "under review",
      "interview scheduled",
      "rejected",
      "hired",
    ];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid application status");
    }

    // Find the job by its ID
    const job = await Job.findById(jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    // Find the application for the candidate
    const application = job.applications.find(
      (app) => app.candidateId.toString() === candidateId
    );
    if (!application) {
      throw new Error("Application not found");
    }

    // Update the application status
    application.status = status;
    await job.save();

    return {
      jobId: job._id,
      candidateId: application.candidateId,
      status: application.status,
    };
  }
}
