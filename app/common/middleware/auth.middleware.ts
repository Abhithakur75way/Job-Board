import { Request, Response, NextFunction } from "express";
import { User } from "../../user/user.schema";
import { AuthService } from "../services/auth.service"; // Import the AuthService
import { CustomError } from "../../utils/custom.error"; // A custom error handler class

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the token from the Authorization header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new CustomError(401, "Authorization token is missing");
    }

    // Ensure that JWT_SECRET is loaded
    const jwtSecret = process.env.JWT_ACCESS_SECRET;
    if (!jwtSecret) {
      throw new CustomError(500, "JWT_ACCESS_SECRET is not defined in .env");
    }

    // Verify the token using the secret key
    const decoded = AuthService.verifyToken(token, jwtSecret);
    if (!decoded) {
      throw new CustomError(401, "Invalid or expired token");
    }

    // Find the user by the decoded `id`
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new CustomError(404, "User not found");
    }

    // Attach the user to the request object
    req.user = user;
    next();
  } catch (err) {
    // Pass the error to the error handler middleware
    next(err);
  }
};
