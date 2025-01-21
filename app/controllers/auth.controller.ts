import { Request, Response } from 'express';
import { UserRegisterDto, UserLoginDto } from '../common/dto/base.dto';
import { UserService } from '../user/user.service'; // Import the UserService

// Register User
/**
 * Registers a new user
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {UserRegisterDto} req.body - Body of the request containing the user's details
 * @returns {Promise<void>} - Promise that resolves with no value
 */
export const registerUser = async (req: Request<{}, {}, UserRegisterDto>, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;

  try {
    // Delegate to UserService for registration logic
    const { newUser, accessToken, refreshToken } = await UserService.registerUser(name, email, password, role);

    // Return success response with tokens
    res.status(201).json({ message: 'User registered', accessToken, refreshToken });
  } catch (err: any) {
    console.error(err);
    // Return error response
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// Login User
export const loginUser = async (req: Request<{}, {}, UserLoginDto>, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Delegate to UserService for login logic
    const { user, accessToken, refreshToken } = await UserService.loginUser(email, password);

    // Return success response with tokens
    res.json({ message: 'Login successful', accessToken, refreshToken });
  } catch (err: any) {
    console.error(err);
    // Return error response
    res.status(400).json({ message: err.message || 'Invalid credentials' });
  }
};

// Refresh Access Token
export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ message: 'Refresh token required' });
    return;
  }

  try {
    // Delegate to UserService to refresh token
    const { newAccessToken } = await UserService.refreshAccessToken(refreshToken);

    // Return new access token
    res.json({ accessToken: newAccessToken });
  } catch (err: any) {
    console.error(err);
    // Return error response if refresh token is invalid or other error occurs
    res.status(401).json({ message: err.message || 'Invalid refresh token' });
  }
};


// Send Password Reset Token
export const sendPasswordResetToken = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const response = await UserService.sendPasswordResetToken(email);
    res.status(200).json(response);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message || 'Error sending password reset token' });
  }
};

// Reset Password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, newPassword } = req.body;

  try {
    const response = await UserService.resetPassword(token, newPassword);
    res.status(200).json(response);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message || 'Error resetting password' });
  }
};