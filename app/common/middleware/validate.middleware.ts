import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

/**
 * Validate middleware to check for errors in request body after express-validator validation.
 * If errors are present, sends a 400 error response with the error messages.
 * If no errors, calls next() to continue the request pipeline.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
     res.status(400).json({ errors: errors.array() });
  }
  else{
  next();
  }
};
