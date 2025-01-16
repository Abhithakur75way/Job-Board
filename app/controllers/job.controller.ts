import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Job from "../employer/job.schema";
import { IUser } from "../user/user.schema";
import { sendEmail } from "../common/services/email.service";
import { uploadResume } from "../common/middleware/upload.middleware";
import { JobService } from "../employer/job.service";

// POST: Create a new job posting (Employer must be authenticated)
export const postJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { title, description, location, type, skills } = req.body;
  
  try {
    if ((req.user as IUser)?.role !== 'employer') {
      return void res.status(403).json({ message: "Only employers can post jobs." });
    }

    const job = await JobService.createJob({
      title,
      description,
      location,
      type,
      skills,
      employerId: (req.user as IUser)._id,
    });

    res.status(201).json(job); // Return job object
  } catch (err) {
    next(err); // Pass error to error handler
  }
};

// GET: Fetch all jobs or filter by location, type, and skills
export const getJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { location, type, skills, search } = req.query;

  try {
    const filter: any = {};

    // Location filter
    if (location) filter.location = location;

    // Job type filter
    if (type) filter.type = type;

    // Skills filter
    if (skills) filter.skills = { $in: (skills as string).split(",") };

    // Search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const jobs = await JobService.getJobs(filter);
    res.status(200).json(jobs);
  } catch (err) {
    next(err); // Pass error to error handler
  }
};

// GET: Get job details by ID (For candidates to apply, or employers to view applications)
export const getJobById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const jobId = req.params.id;

  try {
    const job = await JobService.getJobById(jobId, req.user as IUser) ;

    if (!job) return void res.status(404).json({ message: "Job not found" });

    res.status(200).json(job);
  } catch (err) {
    next(err); // Pass error to error handler
  }
};

// POST: Apply for a job (Candidate must be authenticated, and resume must be uploaded)
export const applyForJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const jobId = req.params.id;
  const candidateId = (req.user as IUser)._id;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return void res.status(400).json({ message: "Invalid job ID format" });
  }

  try {
    const resume = req.file?.path;

    if (!resume) {
      return void res.status(400).json({ message: "Resume is required" });
    }

    const job = await JobService.applyForJob(jobId, candidateId, resume);

    await sendEmail(job.employerEmail, "New Job Application Received", `New application received for the job: ${job.job.title}`);
    await sendEmail((req.user as IUser)?.email!, "Application Submitted", `Your application for the job: ${job.job.title} has been submitted successfully.`);

    res.status(200).json({ message: "Application submitted successfully" });
  } catch (err) {
    next(err); // Pass error to error handler
  }
};

// POST: Apply for a job with resume upload (Candidate must be authenticated)
export const applyForJobWithResume = uploadResume.single("resume");
