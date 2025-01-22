import { Request, Response, NextFunction } from "express";
import { IUser } from "../user/user.entity";
import { sendEmail } from "../common/services/email.service";
import { uploadResume } from "../common/middleware/upload.middleware";
import { JobService } from "./job.service";

// POST: Create a new job posting (Employer must be authenticated)
export const postJob = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { title, description, location, type, skills, } = req.body;

  try {
    if ((req.user as IUser)?.role !== "employer") {
      return void res
        .status(403)
        .json({ message: "Only employers can post jobs." });
    }

    const job = await JobService.createJob({
      title,
      description,
      location,
      type,
      skills,
      employerId: (req.user as IUser).id, // Use number here
    });

    res.status(201).json(job); // Return job object
  } catch (err) {
    next(err); // Pass error to error handler
  }
};

// GET: Fetch all jobs or filter by location, type, and skills
export const getJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { location, type, skills, search } = req.query;

  try {
    const filter: any = {};

    // Location filter (PostgreSQL: exact match)
    if (location) filter.location = location;

    // Job type filter (PostgreSQL: exact match)
    if (type) filter.type = type;

    // Skills filter (PostgreSQL: use array contains for skills)
    if (skills && typeof skills === 'string') {
      filter.skills = skills.split(","); // assuming skills is an array
    }

    // Search functionality (PostgreSQL: case-insensitive search with ILIKE)
    if (search) {
      filter.search = `%${search}%`;
    }

    const jobs = await JobService.getJobs(filter);
    res.status(200).json(jobs);
  } catch (err) {
    next(err); // Pass error to error handler
  }
};

// GET: Get job details by ID (For candidates to apply, or employers to view applications)
export const getJobById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const jobId = parseInt(req.params.id); // Convert jobId to number

  try {
    const job = await JobService.getJobById(jobId, (req.user as IUser).id);

    if (!job) return void res.status(404).json({ message: "Job not found" });

    res.status(200).json(job);
  } catch (err) {
    next(err); // Pass error to error handler
  }
};

// POST: Apply for a job (Candidate must be authenticated, and resume must be uploaded)
export const applyForJob = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const jobId = parseInt(req.params.id); // Convert jobId to number
  const candidateId = (req.user as IUser).id; // Get candidateId as number

  if (isNaN(jobId)) {
    return void res.status(400).json({ message: "Invalid job ID format" });
  }

  try {
    const resume = req.file?.path;

    if (!resume) {
      return void res.status(400).json({ message: "Resume is required" });
    }

    const { job, employerEmail } = await JobService.applyForJob(
      jobId,
      candidateId,
      resume
    );

    // Send email notifications
    await sendEmail(
      employerEmail,
      "New Job Application Received",
      `New application received for the job: ${job.title}`
    );
    await sendEmail(
      (req.user as IUser)?.email!,
      "Application Submitted",
      `Your application for the job: ${job.title} has been submitted successfully.`
    );

    res.status(200).json({ message: "Application submitted successfully" });
  } catch (err) {
    next(err); // Pass error to error handler
  }
};

// POST: Apply for a job with resume upload (Candidate must be authenticated)
export const applyForJobWithResume = uploadResume.single("resume");

// Fetches all job applications for the authenticated candidate.
export const trackApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const candidateId = (req.user as IUser).id; // Get candidateId as number

  try {
    const applications = await JobService.getCandidateApplications(candidateId);

    if (!applications.length) {
      return void res.status(404).json({ message: "No applications found" });
    }

    res.status(200).json(applications);
  } catch (err) {
    next(err); // Pass error to error handler
  }
};

// Updates the status of a job application.
export const updateApplicationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { jobId, candidateId, status } = req.body;

  try {
    const updatedApplication = await JobService.updateApplicationStatus(
      jobId,
      candidateId,
      status
    );
    res
      .status(200)
      .json({
        message: "Application status updated",
        application: updatedApplication,
      });
  } catch (err) {
    next(err); // Pass error to error handler
  }
};
