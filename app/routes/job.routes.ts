import { Router, Request, Response, NextFunction } from "express";
import { postJob, getJobs, getJobById, applyForJob } from "../controllers/job.controller";
import { authMiddleware } from "../common/middleware/auth.middleware";
import multer from "multer";

const router = Router();

// Multer setup for handling file uploads (resume)
const upload = multer({ dest: "uploads/resumes/" });

/**
 * @swagger
 * /api/jobs/post:
 *   post:
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
 *         enum: [full-time, part-time, contract]
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
 *       500:
 *         description: Server error
 */
router.get("/", getJobs);

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
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

export default router;
