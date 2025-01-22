import { AppDataSource } from "../data-source";
import { Job } from "./job.entity";
import { JobApplication } from "./job-application.entity";
import { User } from "../user/user.entity";
import { JobDto } from "./job.dto"; // DTO for creating new jobs



export class JobService {
  // Create a new job
  static async createJob({
    title,
    description,
    location,
    type,
    skills,
    employerId,
  }: JobDto & { employerId: number }) {
    const jobRepository = AppDataSource.getRepository(Job);
    const employerRepository = AppDataSource.getRepository(User);  // Changed here

    // Find the employer by ID
    const employer = await employerRepository.findOne({
      where: { id: employerId },
    });

    // If employer not found or role is not 'employer', throw an error
    if (!employer) throw new Error("Employer not found");
    if (employer.role !== "employer") {
      throw new Error("Invalid employer");
    }

    // Create the job and associate it with the employer
    const job = jobRepository.create({
      title,
      description,
      location,
      type,
      skills,
      employer,
    });

    // Save the job to the database
    await jobRepository.save(job);
    return job;
  }

  // Get all jobs with filters
  static async getJobs(filter: any) {
    const jobRepository = AppDataSource.getRepository(Job);  // Changed here

    // Filter logic based on the parameters provided
    return await jobRepository.find({
      where: filter,
      relations: ["employer"], // Populate employer info
    });
  }

  // Get job details by ID (also for employer to see applications)
  static async getJobById(jobId: number, userId: number) {
    const jobRepository = AppDataSource.getRepository(Job);  // Changed here

    // Find the job by its ID along with related applications and employer
    const job = await jobRepository.findOne({
      where: { id: jobId },
      relations: ["employer", "applications", "applications.candidate"],
    });

    if (!job) throw new Error("Job not found");

    // If the user is the employer, return the job with applications
    if (job.employer.id === userId) {
      return job;
    } else {
      // Otherwise, return only the job details (without applications)
      const { applications, ...jobDetails } = job;
      return jobDetails;
    }
  }

  // Apply for a job
  static async applyForJob(
    jobId: number,
    candidateId: number,
    resumeUrl: string
  ) {
    const jobRepository = AppDataSource.getRepository(Job);  // Changed here
    const applicationRepository = AppDataSource.getRepository(JobApplication);  // Changed here

    // Find the job by ID and populate the employer relationship
    const job = await jobRepository.findOne({
      where: { id: jobId },
      relations: ["employer", "applications"],
    });

    if (!job) throw new Error("Job not found");

    // Check if the candidate has already applied for the job
    const alreadyApplied = job.applications.some(
      (app) => app.candidate.id === candidateId
    );
    if (alreadyApplied) {
      throw new Error("You have already applied for this job");
    }

    // Create a new job application for the candidate
    const application = applicationRepository.create({
      job,
      candidate: { id: candidateId }, // assuming candidate exists
      resumeUrl,
      status: "applied",
    });

    // Save the application
    await applicationRepository.save(application);

    // Return the job, application, and employer's email
    return {
      job,
      application,
      employerEmail: job.employer.email, // Add employer email here
    };
  }

  // Fetch all applications for a candidate
  static async getCandidateApplications(candidateId: number) {
    const applicationRepository = AppDataSource.getRepository(JobApplication);  // Changed here

    // Find all applications where the candidate is the applicant
    const applications = await applicationRepository.find({
      where: { candidate: { id: candidateId } },
      relations: ["job", "job.employer"],
    });

    // Return application details with job and employer info
    return applications.map((app) => ({
      jobId: app.job.id,
      jobTitle: app.job.title,
      employer: app.job.employer,
      status: app.status,
      appliedAt: app.createdAt,
    }));
  }

  // Update the status of a candidate's application
  static async updateApplicationStatus(
    jobId: number,
    candidateId: number,
    status: string
  ) {
    const validStatuses = [
      "applied",
      "under review",
      "interview scheduled",
      "rejected",
      "hired",
    ];

    // Validate if the status is one of the valid statuses
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid application status");
    }

    const jobRepository = AppDataSource.getRepository(Job);  // Changed here

    // Find the job by its ID and populate the applications
    const job = await jobRepository.findOne({
      where: { id: jobId },
      relations: ["applications"],
    });

    if (!job) throw new Error("Job not found");

    // Find the application for the candidate
    const application = job.applications.find(
      (app) => app.candidate.id === candidateId
    );
    if (!application) throw new Error("Application not found");

    // Update the application status
    application.status = status;

    // Save the updated application status
    await AppDataSource.getRepository(JobApplication).save(application);

    return {
      jobId: job.id,
      candidateId: application.candidate.id,
      status: application.status,
    };
  }
}
