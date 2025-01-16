import { Router } from "express";
import { registerUser, loginUser, refreshAccessToken } from "../controllers/auth.controller";
import { check } from "express-validator";
import { validate } from "../common/middleware/validate.middleware";

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Allows a new user to register (either employer or candidate)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *               email:
 *                 type: string
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password (must be at least 6 characters)
 *               role:
 *                 type: string
 *                 enum: [employer, candidate]
 *                 description: User's role
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request (validation errors)
 *       500:
 *         description: Server error
 */
router.post(
  "/register",
  [
    check("name").notEmpty().withMessage("Name is required"),
    check("email").isEmail().withMessage("Invalid email"),
    check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    check("role").isIn(["employer", "candidate"]).withMessage("Role is required"),
  ],
  validate,
  registerUser
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login an existing user
 *     description: Allows a registered user to login with their email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Login successful, returns access token and refresh token
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */
router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Invalid email"),
    check("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  loginUser
);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Allows a user to refresh their access token using a refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token
 *     responses:
 *       200:
 *         description: Returns a new access token
 *       400:
 *         description: Missing or invalid refresh token
 *       500:
 *         description: Server error
 */
router.post("/refresh", refreshAccessToken);

export default router;
