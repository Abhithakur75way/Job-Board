import { Router } from "express";
import {
  postJob,
  getJobs,
  getJobById,
  applyForJob,
  trackApplications,
  updateApplicationStatus,
} from "./job.controller";
import { authMiddleware } from "../common/middleware/auth.middleware";
import multer from "multer";

const router = Router();

// Multer setup for handling file uploads (resume)
const upload = multer({ dest: "uploads/resumes/" });

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Endpoints for managing job postings and applications
 */

/**
 * @swagger
 * /api/jobs/post:
 *   post:
 *     tags: [Jobs]
 *     summary: Create a new job post
 *     description: Only authenticated employers can post jobs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - location
 *               - type
 *               - skills
 *             properties:
 *               title:
 *                 type: string
 *                 description: Job title
 *               description:
 *                 type: string
 *                 description: Job description
 *               location:
 *                 type: string
 *                 description: Job location
 *               type:
 *                 type: string
 *                 enum: [full-time, part-time, contract]
 *                 description: Job type
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Skills required for the job
 *     responses:
 *       201:
 *         description: Job created successfully
 *       403:
 *         description: Forbidden (Only employers can post jobs)
 *       500:
 *         description: Server error
 */
router.post("/post", authMiddleware, postJob);

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     tags: [Jobs]
 *     summary: Get all jobs or filter jobs by query parameters
 *     description: Fetch a list of jobs with optional filters (location, type, skills, search)
 *     parameters:
 *       - in: query
 *         name: location
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter jobs by location
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           enum: [full-time, part-time, contract]
 *         description: Filter jobs by type
 *       - in: query
 *         name: skills
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter jobs by skills (comma-separated)
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Search term (for title or description)
 *     responses:
 *       200:
 *         description: List of jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Server error
 */
router.get("/", getJobs);

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     tags: [Jobs]
 *     summary: Get job details by ID
 *     description: Fetch the details of a specific job by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job details
 *       404:
 *         description: Job not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getJobById);

/**
 * @swagger
 * /api/jobs/{id}/apply:
 *   post:
 *     tags: [Jobs]
 *     summary: Apply for a job
 *     description: Candidate applies for a job with resume upload
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - resume
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *                 description: Resume file
 *     responses:
 *       200:
 *         description: Application submitted successfully
 *       400:
 *         description: Invalid job ID or already applied
 *       500:
 *         description: Server error
 */
router.post("/:id/apply", authMiddleware, upload.single("resume"), applyForJob);

/**
 * @swagger
 * /api/jobs/applications:
 *   get:
 *     tags: [Jobs]
 *     summary: Track job applications
 *     description: Fetch all job applications for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of applications
 *       403:
 *         description: Forbidden (Only authenticated users can access this)
 *       500:
 *         description: Server error
 */
router.get("/applications", authMiddleware, trackApplications);

/**
 * @swagger
 * /api/jobs/applications/status:
 *   put:
 *     tags: [Jobs]
 *     summary: Update application status
 *     description: Employers can update the status of job applications
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - applicationId
 *               - status
 *             properties:
 *               applicationId:
 *                 type: string
 *                 description: ID of the application
 *               status:
 *                 type: string
 *                 enum: [pending, accepted, rejected]
 *                 description: New status for the application
 *     responses:
 *       200:
 *         description: Application status updated successfully
 *       403:
 *         description: Forbidden (Only employers can update application status)
 *       500:
 *         description: Server error
 */
router.put("/applications/status", authMiddleware, updateApplicationStatus);

export default router;
